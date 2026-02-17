# AiMotion

AiMotion is a real-time browser-based computer vision application built with React and Vite. It uses MediaPipe to perform face mesh and hand tracking directly in the browser, enabling gesture-based interaction without external hardware or backend processing.

---

## 🔗 Live Demo

**Production Deployment:**  
https://aimotionctrl.netlify.app/

---

## 📌 Overview

AiMotion leverages modern web technologies and MediaPipe’s machine learning models to:

- Detect and track hand landmarks in real time  
- Generate detailed face mesh landmarks  
- Process webcam video directly in the browser  
- Render detection overlays dynamically  
- Maintain high performance with Vite and React 19  

All processing runs client-side, ensuring low latency and improved privacy.

---

## 🛠 Tech Stack

### Frontend
- React 19  
- React DOM 19  
- Vite 7  

### Computer Vision
- @mediapipe/face_mesh  
- @mediapipe/hands  
- @mediapipe/camera_utils  
- @mediapipe/drawing_utils  

### Styling
- Tailwind CSS v4  
- PostCSS  
- Autoprefixer  

### Code Quality & Tooling
- ESLint 9  
- @vitejs/plugin-react  
- eslint-plugin-react-hooks  
- eslint-plugin-react-refresh  

---

## 🏗 Architecture

The application follows a modular frontend architecture:


Core workflow:

1. Webcam stream is initialized using MediaPipe camera utilities.  
2. Video frames are processed by MediaPipe models.  
3. Face and hand landmarks are extracted.  
4. Landmarks are rendered onto canvas overlays.  
5. React manages UI updates and interaction state.  

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
