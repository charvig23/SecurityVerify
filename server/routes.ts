import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createWorker } from "tesseract.js";
import sharp from "sharp";
import { insertVerificationSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
  }
});

// OCR processing function
async function processOCR(imagePath: string): Promise<{ text: string; name?: string; age?: number; dob?: string }> {
  const worker = await createWorker('eng');
  
  try {
    // Preprocess image for better OCR
    const processedImagePath = imagePath + '_processed.jpg';
    await sharp(imagePath)
      .resize(1200, null, { withoutEnlargement: true })
      .normalize()
      .sharpen()
      .jpeg({ quality: 90 })
      .toFile(processedImagePath);

    const { data: { text } } = await worker.recognize(processedImagePath);
    
    // Clean up processed image
    fs.unlinkSync(processedImagePath);
    
    // Extract information from OCR text
    const result = extractInfoFromText(text);
    
    return result;
  } finally {
    await worker.terminate();
  }
}

// Extract name, age, and DOB from OCR text
function extractInfoFromText(text: string): { text: string; name?: string; age?: number; dob?: string } {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let name: string | undefined;
  let dob: string | undefined;
  let age: number | undefined;

  // Common patterns for Indian Aadhar cards and other IDs
  for (const line of lines) {
    // Name extraction (usually appears after certain keywords)
    if (!name && (line.includes('Name') || line.includes('नाम'))) {
      const nameParts = line.split(/[:]/);
      if (nameParts.length > 1) {
        name = nameParts[1].trim().replace(/[^a-zA-Z\s]/g, '');
      }
    } else if (!name && /^[A-Z][a-z]+ [A-Z][a-z]+/.test(line)) {
      // Detect name pattern (Title Case)
      name = line.replace(/[^a-zA-Z\s]/g, '').trim();
    }

    // DOB extraction
    if (!dob) {
      const dobMatch = line.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/);
      if (dobMatch) {
        dob = dobMatch[1];
      }
    }

    // Age extraction
    if (!age) {
      const ageMatch = line.match(/(?:Age|age|उम्र)[\s:]*(\d{1,3})/);
      if (ageMatch) {
        age = parseInt(ageMatch[1]);
      }
    }
  }

  // Calculate age from DOB if DOB found but age not found
  if (dob && !age) {
    try {
      const dobDate = new Date(dob.replace(/[\/\-\.]/g, '/'));
      const today = new Date();
      age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
    } catch (error) {
      console.error('Error calculating age from DOB:', error);
    }
  }

  return { text, name, age, dob };
}

// Simple face comparison (mock implementation - in real app would use face-api.js)
function calculateFaceMatchScore(): number {
  // Mock implementation - returns random score between 70-95
  // In real implementation, this would use face-api.js to compare faces
  return Math.floor(Math.random() * 25) + 70;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Upload document endpoint
  app.post('/api/upload-document', upload.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Process OCR
      const ocrResult = await processOCR(req.file.path);
      
      // Create verification record
      const verificationData = {
        documentPath: req.file.path,
        selfiePath: '', // Will be updated when selfie is uploaded
        extractedName: ocrResult.name || null,
        extractedAge: ocrResult.age || null,
        extractedDob: ocrResult.dob || null,
        faceMatchScore: null,
        ageVerified: false,
        identityVerified: false,
        status: 'document_processed',
      };

      const verification = await storage.createVerificationRecord(verificationData);
      
      res.json({
        success: true,
        verificationId: verification.id,
        extractedData: {
          name: ocrResult.name,
          age: ocrResult.age,
          dob: ocrResult.dob,
          text: ocrResult.text,
        }
      });

    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({ message: 'Failed to process document' });
    }
  });

  // Upload selfie endpoint
  app.post('/api/upload-selfie', upload.single('selfie'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No selfie uploaded' });
      }

      const { verificationId } = req.body;
      if (!verificationId) {
        return res.status(400).json({ message: 'Verification ID required' });
      }

      const verification = await storage.getVerificationRecord(parseInt(verificationId));
      if (!verification) {
        return res.status(404).json({ message: 'Verification record not found' });
      }

      // Update verification record with selfie path
      await storage.updateVerificationRecord(parseInt(verificationId), {
        selfiePath: req.file.path,
        status: 'selfie_uploaded',
      });

      res.json({ success: true });

    } catch (error) {
      console.error('Selfie upload error:', error);
      res.status(500).json({ message: 'Failed to upload selfie' });
    }
  });

  // Process verification endpoint
  app.post('/api/process-verification', async (req, res) => {
    try {
      const { verificationId } = req.body;
      if (!verificationId) {
        return res.status(400).json({ message: 'Verification ID required' });
      }

      const verification = await storage.getVerificationRecord(parseInt(verificationId));
      if (!verification) {
        return res.status(404).json({ message: 'Verification record not found' });
      }

      if (!verification.selfiePath) {
        return res.status(400).json({ message: 'Selfie not uploaded' });
      }

      // Calculate face match score (mock implementation)
      const faceMatchScore = calculateFaceMatchScore();
      
      // Determine verification results
      const identityVerified = faceMatchScore >= 65; // 65% threshold
      const ageVerified = verification.extractedAge !== null && verification.extractedAge >= 18;

      // Update verification record
      const updatedVerification = await storage.updateVerificationRecord(parseInt(verificationId), {
        faceMatchScore,
        identityVerified,
        ageVerified,
        status: 'completed',
        completedAt: new Date(),
      });

      res.json({
        success: true,
        results: {
          identityVerified,
          ageVerified,
          faceMatchScore,
          extractedAge: verification.extractedAge,
          extractedName: verification.extractedName,
        }
      });

    } catch (error) {
      console.error('Verification processing error:', error);
      res.status(500).json({ message: 'Failed to process verification' });
    }
  });

  // Get verification status endpoint
  app.get('/api/verification/:id', async (req, res) => {
    try {
      const verificationId = parseInt(req.params.id);
      const verification = await storage.getVerificationRecord(verificationId);
      
      if (!verification) {
        return res.status(404).json({ message: 'Verification record not found' });
      }

      res.json(verification);

    } catch (error) {
      console.error('Get verification error:', error);
      res.status(500).json({ message: 'Failed to get verification record' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
