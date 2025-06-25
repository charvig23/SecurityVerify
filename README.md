# 📷 Aadhar-Based ID Verification App

A web-based system to verify if an uploaded Aadhar document and a live selfie belong to the same person, and if they meet an age requirement (e.g., 18+).

## ✨ Features

- Extract photo and DOB from Aadhar (image/PDF)
- Capture selfie via webcam
- Face comparison + age estimation
- Determine if identity matches and age ≥ 18

---

## 🧰 Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Vite, TanStack Query
- react-webcam, react-hook-form, zod

### Backend
- Node.js + Express.js
- PostgreSQL (Neon) + Drizzle ORM
- multer, Sharp, Tesseract.js

### Verification
- Multi-pass OCR (Tesseract.js)
- Image preprocessing (Sharp)
- Color channel face comparison
- Facial feature age estimation
- Confidence scoring
