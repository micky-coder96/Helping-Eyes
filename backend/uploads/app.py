import os
import platform
import logging
import traceback
from collections import Counter

import cv2
import numpy as np
import pytesseract
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("helping-eyes-backend")

app = Flask(__name__)
CORS(app)

app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10 MB


def resolve_tesseract_path():
    env_path = os.environ.get("TESSERACT_CMD")
    if env_path and os.path.exists(env_path):
        return env_path

    if platform.system() == "Windows":
        candidates = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        ]
        for c in candidates:
            if os.path.exists(c):
                return c

    return "tesseract"


pytesseract.pytesseract.tesseract_cmd = resolve_tesseract_path()

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "bmp"}
IGNORE_WORDS = {
    "g",
    "kg",
    "mg",
    "ml",
    "l",
    "mrp",
    "price",
    "net",
    "wt",
    "gram",
    "grams",
    "expiry",
    "exp",
    "batch",
    "mfg",
    "date",
    "new",
    "offer",
    "free",
    "rs",
    "inr",
}
MIN_CONFIDENCE = 35
LOW_CONFIDENCE_FALLBACK = 20
OCR_PSM_MODES = ["6", "11"]

BLUR_THRESHOLD = 60
DARK_THRESHOLD = 60
BRIGHT_THRESHOLD = 210
QUALITY_CHECK_WIDTH = 800

# -----------------------------
# YOLO product localization
# -----------------------------
# Pretrained on COCO's 80 general classes (bottle, cup, book, handbag, etc.)
# There is no generic "product/package" class, so this helps for
# bottle/can/box-like items and gracefully falls back to the full frame
# for anything that doesn't match a COCO class (e.g. flat snack pouches).
YOLO_MODEL_PATH = os.environ.get("YOLO_MODEL_PATH", "yolov8n.pt")
YOLO_CONF_THRESHOLD = 0.25
YOLO_EXCLUDED_CLASSES = {0}  # 0 = "person" - avoids cropping to a hand/arm
YOLO_MAX_BOX_AREA_RATIO = (
    0.92  # skip boxes that cover almost the whole frame (no cropping benefit)
)
YOLO_BOX_PADDING_RATIO = 0.08  # pad the crop so edge text isn't clipped

_yolo_model = None
_yolo_load_attempted = False


def get_yolo_model():
    """
    Loaded once and cached. Loading YOLO per-request would add real
    latency to every scan, so this is called once at startup (see bottom
    of file) and reused for every request after that.
    """
    global _yolo_model, _yolo_load_attempted
    if _yolo_load_attempted:
        return _yolo_model

    _yolo_load_attempted = True
    if YOLO is None:
        logger.warning("ultralytics not installed - run: pip install ultralytics")
        return None

    try:
        _yolo_model = YOLO(YOLO_MODEL_PATH)
        logger.info("YOLO model loaded: %s", YOLO_MODEL_PATH)
    except Exception as e:
        logger.error("Failed to load YOLO model (%s) - continuing without cropping", e)
        _yolo_model = None

    return _yolo_model


def detect_product_bbox(image_bgr):
    """
    Runs class-agnostic detection: we don't care WHAT COCO class it thinks
    the object is, only where the most prominent non-person object sits,
    since that's almost always the product being held up to the camera.
    Returns None if YOLO isn't available or found nothing usable - callers
    must fall back to the full image in that case.
    """
    model = get_yolo_model()
    if model is None:
        return None

    h, w = image_bgr.shape[:2]
    image_area = h * w

    results = model.predict(source=image_bgr, conf=YOLO_CONF_THRESHOLD, verbose=False)[
        0
    ]

    best = None
    best_score = -1.0
    for box in results.boxes:
        cls_id = int(box.cls[0])
        if cls_id in YOLO_EXCLUDED_CLASSES:
            continue

        conf = float(box.conf[0])
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        box_area = max(0.0, x2 - x1) * max(0.0, y2 - y1)

        if box_area <= 0 or box_area / image_area > YOLO_MAX_BOX_AREA_RATIO:
            continue

        score = conf * box_area
        if score > best_score:
            best_score = score
            best = (x1, y1, x2, y2, conf, cls_id)

    if best is None:
        return None

    x1, y1, x2, y2, conf, cls_id = best
    box_w, box_h = x2 - x1, y2 - y1
    pad_x, pad_y = box_w * YOLO_BOX_PADDING_RATIO, box_h * YOLO_BOX_PADDING_RATIO

    x1 = max(0, int(x1 - pad_x))
    y1 = max(0, int(y1 - pad_y))
    x2 = min(w, int(x2 + pad_x))
    y2 = min(h, int(y2 + pad_y))

    class_name = model.names.get(cls_id, str(cls_id))

    return {
        "box": [x1, y1, x2, y2],
        "confidence": round(conf, 3),
        "class_name": class_name,
    }


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def assess_image_quality(image_bgr):
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape
    if w != QUALITY_CHECK_WIDTH:
        scale = QUALITY_CHECK_WIDTH / w
        gray_norm = cv2.resize(
            gray, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA
        )
    else:
        gray_norm = gray

    sharpness = cv2.Laplacian(gray_norm, cv2.CV_64F).var()
    brightness = float(np.mean(gray_norm))

    return {
        "sharpness": round(float(sharpness), 1),
        "brightness": round(brightness, 1),
        "is_blurry": sharpness < BLUR_THRESHOLD,
        "is_too_dark": brightness < DARK_THRESHOLD,
        "is_too_bright": brightness > BRIGHT_THRESHOLD,
    }


def adjust_gamma(gray, gamma=1.6):
    inv_gamma = 1.0 / gamma
    table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in range(256)]).astype(
        "uint8"
    )
    return cv2.LUT(gray, table)


def unsharp_mask(gray, sigma=1.0, strength=1.5):
    blurred = cv2.GaussianBlur(gray, (0, 0), sigma)
    return cv2.addWeighted(gray, 1 + strength, blurred, -strength, 0)


def build_binary_variants(image_bgr, quality):
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)

    if quality["is_too_dark"]:
        gray = cv2.fastNlMeansDenoising(gray, h=10)
        gray = adjust_gamma(gray, gamma=1.8)

    gray = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8)).apply(gray)

    if quality["is_blurry"]:
        gray = unsharp_mask(gray, sigma=1.2, strength=1.8)

    h, w = gray.shape
    target_width = 1600
    scale = target_width / w if w < target_width else 1.0
    if scale != 1.0:
        gray = cv2.resize(gray, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    _, binary_normal = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    binary_inverted = cv2.bitwise_not(binary_normal)

    kernel = np.ones((2, 2), np.uint8)
    binary_normal = cv2.morphologyEx(binary_normal, cv2.MORPH_CLOSE, kernel)
    binary_inverted = cv2.morphologyEx(binary_inverted, cv2.MORPH_CLOSE, kernel)

    variants = [("normal", binary_normal), ("inverted", binary_inverted)]

    if quality["is_blurry"] or quality["is_too_dark"]:
        adaptive = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 25, 10
        )
        adaptive = cv2.morphologyEx(adaptive, cv2.MORPH_CLOSE, kernel)
        variants.append(("adaptive", adaptive))
        variants.append(("adaptive_inverted", cv2.bitwise_not(adaptive)))

    return variants


def ink_fraction(binary_crop):
    if binary_crop.size == 0:
        return 0.0
    white = int(np.count_nonzero(binary_crop))
    black = binary_crop.size - white
    return min(white, black) / binary_crop.size


def run_ocr_pass(variants, min_confidence):
    lines = {}
    for variant_name, binary_img in variants:
        for psm in OCR_PSM_MODES:
            config = f"--oem 3 --psm {psm} -l eng"
            data = pytesseract.image_to_data(
                binary_img, config=config, output_type=pytesseract.Output.DICT
            )

            for i in range(len(data["text"])):
                word = data["text"][i].strip()
                if not word:
                    continue

                try:
                    conf = float(data["conf"][i])
                except (ValueError, TypeError):
                    conf = 0

                if conf < min_confidence:
                    continue
                if word.lower() in IGNORE_WORDS:
                    continue

                left = data["left"][i]
                top = data["top"][i]
                width = data["width"][i]
                height = data["height"][i]
                if width <= 0 or height <= 0:
                    continue

                crop = binary_img[top : top + height, left : left + width]
                boldness = ink_fraction(crop)

                key = (variant_name, psm, data["block_num"][i], data["line_num"][i])
                line = lines.setdefault(
                    key,
                    {
                        "words": [],
                        "heights": [],
                        "area": 0,
                        "confs": [],
                        "boldness": [],
                    },
                )
                line["words"].append(word)
                line["heights"].append(height)
                line["area"] += width * height
                line["confs"].append(conf)
                line["boldness"].append(boldness)
    return lines


def score_lines(lines):
    scored_by_text = {}
    for line in lines.values():
        text = " ".join(line["words"])
        norm_key = text.lower().strip()
        if not norm_key:
            continue

        avg_height = sum(line["heights"]) / len(line["heights"])
        avg_conf = sum(line["confs"]) / len(line["confs"])
        avg_boldness = sum(line["boldness"]) / len(line["boldness"])
        word_count = len(line["words"])

        score = (
            (avg_height**2) * 10
            + avg_boldness * 8000
            + line["area"] * 0.05
            + avg_conf * 5
            + word_count * 50
        )

        logger.info(
            "Line: %r | avg_height=%.1f boldness=%.2f area=%d conf=%.1f score=%.2f",
            text,
            avg_height,
            avg_boldness,
            line["area"],
            avg_conf,
            score,
        )

        if norm_key not in scored_by_text or score > scored_by_text[norm_key][0]:
            scored_by_text[norm_key] = (score, text)

    return scored_by_text


def extract_largest_text(image_bgr, quality):
    variants = build_binary_variants(image_bgr, quality)

    lines = run_ocr_pass(variants, MIN_CONFIDENCE)
    scored = score_lines(lines)
    low_confidence = False

    if not scored:
        logger.info("No lines passed MIN_CONFIDENCE, retrying at lower threshold")
        lines = run_ocr_pass(variants, LOW_CONFIDENCE_FALLBACK)
        scored = score_lines(lines)
        low_confidence = True

    if not scored:
        return "", True

    best_score, best_text = max(scored.values(), key=lambda t: t[0])
    return best_text.strip(), low_confidence


def detect_dominant_color(image_bgr, k=3):
    small = cv2.resize(image_bgr, (150, 150), interpolation=cv2.INTER_AREA)
    hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
    pixels = hsv.reshape(-1, 3).astype(np.float32)

    mask = (pixels[:, 1] > 40) & (pixels[:, 2] > 40) & (pixels[:, 2] < 250)
    filtered = pixels[mask]
    if len(filtered) < k:
        filtered = pixels

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
    _, labels, centers = cv2.kmeans(
        filtered, k, None, criteria, 5, cv2.KMEANS_RANDOM_CENTERS
    )

    counts = Counter(labels.flatten().tolist())
    dominant_idx = counts.most_common(1)[0][0]
    h, s, v = centers[dominant_idx]

    return hsv_to_color_name(h, s, v)


def hsv_to_color_name(h, s, v):
    if v < 40:
        return "Black"
    if s < 25 and v > 210:
        return "White"
    if s < 30:
        return "Gray"
    if h < 5 or h >= 175:
        return "Red"
    if h < 15:
        return "Dark Orange"
    if h < 25:
        return "Orange"
    if h < 35:
        return "Yellow"
    if h < 45:
        return "Lime"
    if h < 85:
        return "Green"
    if h < 100:
        return "Turquoise"
    if h < 125:
        return "Sky Blue"
    if h < 145:
        return "Blue"
    if h < 160:
        return "Purple"
    if h < 170:
        return "Pink"
    return "Unknown"


def build_quality_feedback(quality, low_confidence, product_text):
    if quality["is_blurry"] and quality["is_too_dark"]:
        return "The photo looks blurry and dark. Please hold the camera steady, move closer to the light, and try again."
    if quality["is_blurry"]:
        return "The photo looks blurry. Please hold the camera steady and try again."
    if quality["is_too_dark"]:
        return "The photo looks too dark. Please move to better lighting and try again."
    if quality["is_too_bright"]:
        return "The photo looks too bright or glared. Try tilting the product to avoid direct light and try again."
    if not product_text:
        return "No product text was found. Please move closer and make sure the label is facing the camera."
    if low_confidence:
        return "Result may not be accurate. Please hold steady and try again for a clearer reading."
    return None


@app.route("/")
def home():
    return "Backend Working"


@app.route("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "tesseract_cmd": pytesseract.pytesseract.tesseract_cmd,
            "yolo_loaded": get_yolo_model() is not None,
        }
    )


@app.route("/ping")
def ping():
    return jsonify({"message": "Phone connected to backend"})


@app.route("/upload", methods=["POST"])
def upload():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]

        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Unsupported file type"}), 400

        logger.info("UPLOAD ROUTE HIT: %s", file.filename)

        image = Image.open(file.stream).convert("RGB")
        image_np = np.array(image)
        image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

        detected_object = detect_product_bbox(image_bgr)
        if detected_object:
            x1, y1, x2, y2 = detected_object["box"]
            cropped = image_bgr[y1:y2, x1:x2]
            if cropped.size > 0:
                processed_image = cropped
                logger.info(
                    "YOLO cropped to %s (class=%s conf=%.2f)",
                    detected_object["box"],
                    detected_object["class_name"],
                    detected_object["confidence"],
                )
            else:
                processed_image = image_bgr
                detected_object = None
        else:
            processed_image = image_bgr

        quality = assess_image_quality(processed_image)
        logger.info("Quality: %s", quality)

        product_text, low_confidence = extract_largest_text(processed_image, quality)
        color = detect_dominant_color(processed_image)

        feedback = build_quality_feedback(quality, low_confidence, product_text)

        logger.info(
            "Detected Product: %s | Color: %s | LowConf: %s",
            product_text,
            color,
            low_confidence,
        )

        return jsonify(
            {
                "product": product_text,
                "ocr_text": product_text,
                "color": color,
                "low_confidence": low_confidence,
                "quality": quality,
                "feedback": feedback,
                "detected_object": detected_object,
            }
        )

    except Exception as e:
        logger.error("Upload failed: %s", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Warm up YOLO once at startup rather than on the first request, so the
# first real user doesn't eat the model-load latency.
get_yolo_model()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
