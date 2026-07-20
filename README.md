# 👁️ Helping Eyes - AI Powered Product Recognition for the Visually Impaired

![React Native](https://img.shields.io/badge/React%20Native-Mobile-blue)
![Python](https://img.shields.io/badge/Python-Flask-green)
![YOLO](https://img.shields.io/badge/YOLO-Object%20Detection-red)
![OpenCV](https://img.shields.io/badge/OpenCV-Computer%20Vision-orange)
![OCR](https://img.shields.io/badge/Tesseract-OCR-yellow)

## 📖 About the Project

Helping Eyes is an AI-powered mobile application built to help visually impaired people identify everyday products independently.

Many visually impaired people face difficulties while shopping because they cannot easily recognize packaged products. Products often look similar in shape but differ in brand, flavor, or color. Helping Eyes solves this problem by using Artificial Intelligence and Computer Vision.(note: many blind person are using mobile phone by  support of talkback feature in phones).

The application allows users to capture an image of any product using their smartphone camera. The image is processed by an AI backend that detects the product, extracts the product name from the packaging, identifies the dominant package color, and finally speaks the result aloud using Text-to-Speech.

The goal of the project is to make shopping safer, faster, and more independent for visually impaired users without requiring assistance from others.

---

# 🎯 Problem Statement

Visually impaired people often face challenges such as:

- Difficulty identifying packaged products.
- Similar-looking product packaging.
- Unable to distinguish colors.
- Dependence on others while shopping.
- Reading product labels is almost impossible.

Helping Eyes addresses these challenges using Artificial Intelligence.

---

# 💡 Solution

Helping Eyes combines multiple AI technologies into a single mobile application.

The workflow is:

```
User
   │
   ▼
Capture Product Image
   │
   ▼
YOLO Object Detection
   │
   ▼
Crop Product Region
   │
   ▼
Image Enhancement
(OpenCV)
   │
   ▼
OCR Text Extraction
(Tesseract OCR)
   │
   ▼
Product Name Detection
(Custom Scoring Algorithm)
   │
   ▼
Color Detection
(OpenCV)
   │
   ▼
Voice Output
(Text-to-Speech)
```

The user simply points the camera at a product, and the application automatically announces:

> "Surf Excel. Blue package."

---

# ✨ Features

## 📷 Product Scanning

- Capture product using camera
- Select image from gallery
- Automatic image upload

---

## 🤖 AI Object Detection

YOLO is used to detect the product inside the captured image.

Instead of processing the entire image, the model focuses only on the product region, improving OCR accuracy and reducing background noise.

---

## 🔍 OCR Text Recognition

The detected product is processed using OCR.

Features include:

- Text extraction
- Noise removal
- Image enhancement
- Adaptive thresholding
- CLAHE enhancement
- Text grouping
- Product name scoring

---

## 📦 Product Name Identification

The application intelligently determines the most probable product name using a custom scoring algorithm.

Instead of simply selecting random text, it considers:

- Text confidence
- Text size
- Word grouping
- Position
- OCR confidence
- Text length

---

## 🎨 Color Detection

Helping Eyes also detects the dominant package color.

Supported colors include:

- Red
- Blue
- Green
- Yellow
- Orange
- Purple
- Pink
- Black
- White
- Gray
- Turquoise

---

## 🔊 Voice Assistance

After detection, the application automatically speaks:

- Product Name
- Package Color

This enables visually impaired users to understand the result without looking at the screen.

---

# 🛠 Technologies Used

## Mobile Application

- React Native CLI
- TypeScript
- Axios
- React Native Image Picker
- React Native TTS

---

## Backend

- Python
- Flask
- Flask-CORS

---

## Artificial Intelligence

- YOLO
- Tesseract OCR
- OpenCV
- NumPy
- Pillow

---

# 🧠 AI Pipeline

```
Camera
   │
   ▼
YOLO
(Object Detection)
   │
   ▼
OpenCV
(Image Processing)
   │
   ▼
OCR
(Text Detection)
   │
   ▼
Scoring Algorithm
(Product Detection)
   │
   ▼
Color Detection
   │
   ▼
Speech Output
```

---

# 📂 Project Structure

```
Helping-Eyes

frontend/
│
├── src/
│   ├── screens/
│   ├── services/
│   ├── components/
│   ├── utils/
│   └── assets/

backend/
│
├── app.py
├── uploads/
├── models/
├── requirements.txt

README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/Helping-Eyes.git

cd Helping-Eyes
```

---

## Install Backend

```bash
pip install -r requirements.txt
```

Run

```bash
python app.py
```

---

## Install Frontend

```bash
npm install
```

Start Metro

```bash
npx react-native start
```

Run Android

```bash
npx react-native run-android
```

---

# 📡 API

## POST /upload

Uploads a product image.

### Response

```json
{
  "product": "Surf Excel",
  "ocr_text": "Surf Excel",
  "color": "Blue"
}
```

---

# 📈 Future Improvements

- Real-time camera detection
- Offline AI model optimization
- Barcode scanning
- QR code support
- Currency recognition
- Medicine identification
- Expiry date detection
- Voice command support
- Multiple language OCR
- Nutrition information detection
- Shopping assistance mode
- Cloud synchronization

---

# 🎯 Real World Applications

Helping Eyes can be used in:

- Grocery shopping
- Supermarkets
- Retail stores
- Homes
- Schools for visually impaired students
- NGOs
- Hospitals
- Smart accessibility devices

---

# 🌍 Impact

Helping Eyes aims to improve accessibility by reducing dependence on others during shopping.

The application empowers visually impaired individuals to identify products independently using AI and voice guidance.

---

# 👨‍💻 Author

**Ansh Burnwal**

B.Tech Student | Android Developer | AI Enthusiast

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Your support motivates future development.
