# 👁️ Helping Eyes - AI Powered Product Recognition for the Visually Impaired

![React Native](https://img.shields.io/badge/React%20Native-Mobile-blue)
![Python](https://img.shields.io/badge/Python-Flask-green)
![YOLO](https://img.shields.io/badge/YOLO-Object%20Detection-red)
![OpenCV](https://img.shields.io/badge/OpenCV-Computer%20Vision-orange)
![OCR](https://img.shields.io/badge/Tesseract-OCR-yellow)
![Accessibility](https://img.shields.io/badge/Accessibility-TalkBack%20Ready-brightgreen)

## 📖 About the Project

Helping Eyes is an **AI-powered mobile application** built to help visually impaired people identify everyday products independently with **full TalkBack support**.

Many visually impaired people face difficulties while shopping because they cannot easily recognize packaged products. Products often look similar in shape but differ in brand, flavor, or color. **Helping Eyes solves this problem using voice-guided AI technology.**

The application allows users to:
- Capture an image of any product using their smartphone camera
- Let AI automatically detect and process the product
- Hear the product name and package color announced via **voice output**
- Shop independently without requiring assistance from others

The goal of the project is to make shopping **safer, faster, and more independent** for visually impaired users, especially those who rely on **Android TalkBack and accessibility features**.

---

# 🎯 Problem Statement

Visually impaired people often face challenges such as:

- ❌ Difficulty identifying packaged products
- ❌ Similar-looking product packaging (same shape, different brands)
- ❌ Unable to distinguish colors
- ❌ Dependence on others while shopping
- ❌ Reading product labels is almost impossible
- ❌ No accessible way to verify product selection

**Helping Eyes addresses these challenges using Artificial Intelligence and voice guidance.**

---

# 💡 Solution

Helping Eyes combines multiple AI technologies into a single **mobile application with full accessibility support**.

### How It Works (Step-by-Step):

```
📱 User Points Camera at Product
    ↓
🤖 YOLO Detects the Product
    ↓
📸 Crops Product Region from Image
    ↓
🔧 Enhances Image Quality (OpenCV)
    ↓
🔤 Extracts Text via OCR (Tesseract)
    ↓
✨ Identifies Product Name (AI Scoring)
    ↓
🎨 Detects Dominant Color (OpenCV)
    ↓
🔊 Announces Result via Text-to-Speech
```

### What the User Hears:

> **"Surf Excel. Blue package."**

All results are announced clearly using **voice output** — no need to look at the screen!

---

# ✨ Features

## 🔊 Voice-First Design

- **Automatic voice announcement** of product name and color
- **Full TalkBack compatibility** for screen reader users.
- **Clear, audible feedback** at every step
- No need to look at the screen — everything is announced

---

## 📷 Easy Product Scanning

- Tap to capture product using camera
- Select image from gallery
- Automatic image upload to AI backend
- Voice feedback confirms capture success

---

## 🤖 AI Object Detection

YOLO detects the product inside the captured image with **high accuracy**.

Instead of processing the entire image:
- ✅ Focuses only on the product region
- ✅ Improves OCR accuracy
- ✅ Reduces background noise
- ✅ Faster processing time

---

## 🔍 OCR Text Recognition

The detected product is processed using advanced OCR techniques:

- Text extraction from product packaging
- Noise removal for clarity
- Image enhancement for visibility
- Adaptive thresholding
- CLAHE enhancement
- Text grouping and analysis
- Confidence-based product name scoring

---

## 📦 Intelligent Product Name Identification

The app determines the most probable product name using a custom scoring algorithm that considers:

- Text confidence levels
- Text size and prominence
- Word grouping patterns
- Text position on package
- OCR confidence scores
- Text length and relevance

**Result:** Accurate product identification, not random text selection

---

## 🎨 Color Detection

Helping Eyes detects the **dominant package color** to provide complete product information.

Supported colors include:

🔴 Red | 🔵 Blue | 🟢 Green | 🟡 Yellow | 🟠 Orange | 🟣 Purple | 🩷 Pink | ⚫ Black | ⚪ White | ⚰️ Gray | 🔷 Turquoise

---

## ♿ Accessibility Features

### TalkBack Support (Android)
- ✅ Full screen reader compatibility
- ✅ Voice announcements for all actions
- ✅ Navigation with gesture support
- ✅ Large touch targets for easy interaction
- ✅ High contrast UI elements

### Built for Independence
- 🎯 Independent product identification
- 🎯 No external assistance required
- 🎯 Real-time voice feedback
- 🎯 Simple, intuitive interface

---

# 🛠 Technologies Used

## Mobile Application (Frontend)

- **React Native CLI** - Cross-platform mobile development
- **TypeScript** - Type-safe code
- **Axios** - API communication
- **React Native Image Picker** - Camera and gallery access
- **React Native TTS** - Text-to-speech voice output

---

## Backend Server

- **Python** - Backend logic
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing

---

## Artificial Intelligence & Computer Vision

- **YOLO** - Object detection
- **Tesseract OCR** - Text recognition
- **OpenCV** - Image processing
- **NumPy** - Numerical computations
- **Pillow** - Image manipulation

---

# 🧠 AI Processing Pipeline

```
📱 Camera Input
    ↓
🤖 YOLO Object Detection
    ↓
🖼️ OpenCV Image Processing
    ↓
🔤 OCR Text Detection (Tesseract)
    ↓
🧮 Scoring Algorithm (Product Matching)
    ↓
🎨 Color Detection Analysis
    ↓
🔊 Speech Output (TTS)
```

---

# 📂 Project Structure

```
Helping-Eyes/

frontend/
  ├── src/
  │   ├── screens/        (UI Screens)
  │   ├── services/       (API Services)
  │   ├── components/     (Reusable Components)
  │   ├── utils/          (Utility Functions)
  │   └── assets/         (Images, Fonts)

backend/
  ├── app.py              (Flask Server)
  ├── uploads/            (Image Storage)
  ├── models/             (AI Models)
  └── requirements.txt    (Dependencies)

README.md
```

---

# 🚀 Installation Guide

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/Helping-Eyes.git
cd Helping-Eyes
```

---

## 2️⃣ Install Backend Dependencies

```bash
pip install -r requirements.txt
```

Run the Flask server:

```bash
python app.py
```

The server will start on `http://localhost:5000`

---

## 3️⃣ Install Frontend Dependencies

```bash
npm install
```

Start Metro bundler:

```bash
npx react-native start
```

Run on Android device/emulator:

```bash
npx react-native run-android
```

---

## ✅ Verify TalkBack Setup

1. Go to **Settings > Accessibility > TalkBack**
2. Enable TalkBack
3. Launch Helping Eyes
4. All buttons and actions will be announced via voice

---

# 📡 API Documentation

## POST /upload

Uploads a product image and processes it with AI.

### Request
```
Content-Type: multipart/form-data
Body: image file
```

### Response

```json
{
  "product": "Surf Excel",
  "ocr_text": "Surf Excel",
  "color": "Blue",
  "confidence": 0.95,
  "status": "success"
}
```

---

# 📈 Future Improvements

🚀 **Planned Features:**

- Real-time camera detection (no capture needed)
- Offline AI model optimization
- Barcode scanning support
- QR code support
- Currency recognition
- Medicine identification and safety warnings
- Expiry date detection
- Voice command support
- Multiple language OCR
- Nutrition information extraction
- Smart shopping assistance mode
- Cloud synchronization
- Voice search by product name

---

# 🎯 Real-World Applications

Helping Eyes can empower users in:

- 🏪 Grocery shopping
- 🏬 Supermarkets
- 🛍️ Retail stores
- 🏠 Home shopping
- 📚 Schools for visually impaired students
- 🤝 NGOs and community organizations
- 🏥 Hospitals and clinics
- 🔧 Smart accessibility devices

---

# 🌍 Impact & Social Mission

### Helping Eyes aims to:

✨ **Improve accessibility** by reducing dependence on others during shopping

🎯 **Empower** visually impaired individuals to identify products independently

🗣️ **Enable voice-guided** AI assistance for everyday tasks

♿ **Promote** digital accessibility and inclusive design

🌟 **Build confidence** in users to shop and make purchasing decisions alone

### For TalkBack Users:

📱 **Fully compatible** with Android TalkBack screen reader
🔊 **Voice announcements** for every action and result
🎯 **Independent operation** — no sighted assistance needed
⚡ **Fast and reliable** product detection

---

# 👨‍💻 Author

**Ansh Burnwal**

- B.Tech Student
- Android Developer
- AI Enthusiast
- Accessibility Advocate

---

# ⭐ Support This Project

If you found this project useful and it helps make shopping more accessible, please consider:

- ⭐ Giving it a **star on GitHub**
- 🤝 Contributing improvements
- 📢 Sharing with visually impaired communities
- 💬 Providing feedback and suggestions

Your support motivates future development and helps build a more accessible world!

---

# 📞 Contact & Feedback

Have suggestions? Found a bug? Want to contribute?

Feel free to:
- Open an issue on GitHub
- Submit a pull request
- Share your feedback

---

**Made with ❤️ for accessibility**
