# 🔍 Accessible Vision Scanner

**Point your camera at any product to identify it instantly.**

An accessibility-first mobile app that helps visually impaired users identify everyday products. Snap a photo (or pick one from the gallery), and the app reads back the product's **name** and **packaging color** out loud — no need to see the screen at all.

---

## 📱 What it looks like

**Home screen**
- 🔊 *"Voice guidance active"* badge — confirms audio feedback is on before the user even scans
- 📷 **Take Photo** — large, high-contrast capture button
- 🖼️ **Choose from Gallery** — fallback for existing images

**Scan result**
```
✅ Scan Successful!

📦 Product:   Colgate
🎨 Color:     Red

🔊 Reading result...  (spoken aloud via TTS)

🕒 07/18/26, 18:30:15

[ ↻ Scan Again ]
```

> Example: scanning a Colgate toothpaste box correctly returns **Product: Colgate**, **Color: Red** — matching the bold, largest text on the packaging and the dominant packaging color, ignoring background and smaller print like ingredients or barcodes.

*(Replace this section with an actual screenshot once available: `![Scan result](docs/scan-result.png)`)*

---

## ✨ Features

- 🅰️ **Largest/boldest text detection** — OCR is tuned to identify the brand name specifically, not just any text on the label (ignores small print like weight, expiry, ingredients)
- 🎨 **Accurate color detection** — uses clustering to isolate the packaging's real color from background and lighting artifacts, instead of a naive whole-image average
- ✂️ **Product localization (YOLOv8)** — detects and crops to the product itself before analysis, cutting out hands/background clutter
- 📷 **Image quality checks** — detects blur, underexposure, and overexposure, and returns spoken guidance ("please hold steady and try again") instead of silently returning a wrong result
- 🔊 **Voice-first UX** — every result and every failure state is designed to be *heard*, not read
- 🔁 **One-tap rescan** — quick retry loop for a fast, low-friction experience

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| **React Native 0.73** | Cross-platform mobile app framework (TypeScript) |
| **Android Studio** | Android SDK, emulator, and native build tooling |
| **VS Code** | Primary code editor for JS/TS development |
| **adb reverse** | Tunnels the physical/emulated device to the local Flask backend during development |

### Backend
| Tool | Purpose |
|---|---|
| **Python + Flask** | REST API serving the mobile app |
| **Tesseract OCR** (`pytesseract`) | Text extraction, scored by font height + stroke "boldness" to isolate the product name from surrounding label text |
| **OpenCV** | Image preprocessing (denoising, sharpening, adaptive thresholding), k-means color clustering |
| **YOLOv8** (`ultralytics`) | Object detection to localize and crop the product before OCR/color analysis |
| **NumPy** | Array/image math throughout the pipeline |

---

## 📂 Project Structure

```
.
├── App.tsx             # React Native app entry point
├── app.py              # Flask backend (OCR + color + object detection)
├── requirements.txt    # Python dependencies
├── package.json         # React Native dependencies
└── .gitignore
```

---

## 🚀 Setup

### Frontend (React Native 0.73)

**Prerequisites:** Node.js, npm/yarn, JDK, Android Studio (with an SDK + emulator, or a physical device with USB debugging enabled)

```bash
npm install
```

**Run on Android:**
```bash
npx react-native run-android
```

**Development networking:** when testing on a physical device connected via USB, tunnel the backend port so the app can reach Flask on your machine:
```bash
adb reverse tcp:5000 tcp:5000
adb reverse tcp:8081 tcp:8081
```

### Backend (Flask)

```bash
pip install -r requirements.txt
```

Install Tesseract OCR on your machine:
- **Windows:** [Tesseract installer](https://github.com/UB-Mannheim/tesseract/wiki)
- **Mac:** `brew install tesseract`
- **Linux:** `sudo apt install tesseract-ocr`

If Tesseract isn't on your system PATH:
```bash
export TESSERACT_CMD="/path/to/tesseract"
```

Run the server:
```bash
python app.py
```

> First run downloads YOLOv8's pretrained weights (`yolov8n.pt`, ~6 MB) — requires internet once.

---

## 🔌 API

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Health check — confirms backend is running |
| `/ping` | GET | Confirms phone-to-backend connectivity |
| `/health` | GET | Reports Tesseract path + YOLO model load status |
| `/upload` | POST | Accepts an image (`image` form field) → returns product name, color, and quality feedback |

### Example `/upload` response

```json
{
  "product": "Colgate",
  "ocr_text": "Colgate",
  "color": "Red",
  "low_confidence": false,
  "quality": {
    "sharpness": 152.3,
    "brightness": 128.7,
    "is_blurry": false,
    "is_too_dark": false,
    "is_too_bright": false
  },
  "feedback": null,
  "detected_object": {
    "box": [95, 60, 610, 430],
    "confidence": 0.68,
    "class_name": "box"
  }
}
```

---

## 🗺️ Roadmap

- [ ] Fine-tune YOLOv8 on a custom "product package" class for broader packaging-shape coverage
- [ ] On-device TTS refinements (adjustable speech rate, language options)
- [ ] Offline-first mode
- [ ] Scan history log

---

## 📄 License

MIT
