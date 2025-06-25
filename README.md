# Zynga SecurityVerify
A React + Vite application for seamless document and identity verification.

# 🚀 Getting Started
## Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name/SecurityVerify

## Install dependencies
npm install

## Start the development server
npm run dev

The app will be available at http://localhost:5173 (or the port shown in your terminal).

# 🛠️ Troubleshooting
## PowerShell Script Error (Windows):
If you get a script execution error, run this in PowerShell:/
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

## PDF Dependencies:
If you encounter errors about jspdf or html2canvas, install them using:
npm install jspdf html2canvas

# 📁 Project Structure
client/src/components/verification-results.tsx – Main verification results component
client/src/components/quality-feedback.tsx – Feedback display component
client/src/components/ui/ – Reusable UI components (Button, Card, etc.)

# 📋 Notes
Requires Node.js and npm installed on your system

If the app integrates with a backend API, make sure the API server is running

You can also mock API endpoints during local development

# ✨ Features
Upload identity documents and selfie

Automatic identity, age, and face match verification

Generate and download a PDF report

Display quality feedback and verification results


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
