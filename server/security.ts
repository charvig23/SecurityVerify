import { Express } from "express";
import helmet from "helmet";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import fs from "fs";

// Rate limiting configurations
const uploadRateLimiter = new RateLimiterMemory({
  keyPrefix: 'upload_limit',
  points: 5, // Number of uploads
  duration: 900, // Per 15 minutes
});

const verificationRateLimiter = new RateLimiterMemory({
  keyPrefix: 'verification_limit',
  points: 3, // Number of verification attempts
  duration: 3600, // Per hour
});

const generalRateLimiter = new RateLimiterMemory({
  keyPrefix: 'general_limit',
  points: 100, // Number of requests
  duration: 900, // Per 15 minutes
});

// Security middleware setup
export function setupSecurity(app: Express) {
  // Security headers - relaxed for development
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "ws:", "wss:"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    } : false, // Disable CSP in development
    crossOriginEmbedderPolicy: false,
  }));

  // General rate limiting
  app.use(async (req, res, next) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      await generalRateLimiter.consume(clientIP);
      next();
    } catch (rejRes) {
      res.status(429).json({
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1,
      });
    }
  });
}

// Rate limiting middleware for uploads
export const uploadRateLimit = async (req: any, res: any, next: any) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    await uploadRateLimiter.consume(clientIP);
    next();
  } catch (rejRes) {
    res.status(429).json({
      message: 'Upload limit exceeded. Please wait before uploading again.',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1,
    });
  }
};

// Rate limiting middleware for verification
export const verificationRateLimit = async (req: any, res: any, next: any) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    await verificationRateLimiter.consume(clientIP);
    next();
  } catch (rejRes) {
    res.status(429).json({
      message: 'Verification limit exceeded. Please wait before trying again.',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1,
    });
  }
};

// Input validation middleware
export const validateFileUpload = [
  body('verificationId').optional().isInt().withMessage('Invalid verification ID'),
];

// File validation and sanitization
export function validateUploadedFile(file: any): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file uploaded' };
  }

  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'File size exceeds 5MB limit' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' };
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const fileExtension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    return { isValid: false, error: 'Invalid file extension' };
  }

  return { isValid: true };
}

// Data encryption utilities
export function encryptSensitiveData(data: string): string {
  // In production, use proper encryption
  return Buffer.from(data).toString('base64');
}

export function decryptSensitiveData(encryptedData: string): string {
  // In production, use proper decryption
  return Buffer.from(encryptedData, 'base64').toString('utf-8');
}

// Secure file deletion
export function secureFileDelete(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Overwrite file with random data before deletion
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const randomData = Buffer.alloc(stats.size, Math.floor(Math.random() * 256));
      
      fs.writeFile(filePath, randomData, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            reject(unlinkErr);
            return;
          }
          resolve();
        });
      });
    } else {
      resolve();
    }
  });
}

// Hash sensitive data
export async function hashSensitiveData(data: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(data, saltRounds);
}

// Verify hashed data
export async function verifyHashedData(data: string, hash: string): Promise<boolean> {
  return bcrypt.compare(data, hash);
}

// Data anonymization for logs
export function anonymizeForLogging(data: any): any {
  if (typeof data === 'string') {
    // Mask sensitive patterns
    return data
      .replace(/\d{4}\s?\d{4}\s?\d{4}\s?\d{4}/g, '**** **** **** ****') // Card numbers
      .replace(/\b\d{12}\b/g, '************') // Aadhar numbers
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '***@***.***'); // Emails
  }
  
  if (typeof data === 'object' && data !== null) {
    const anonymized: any = {};
    for (const key in data) {
      if (key.toLowerCase().includes('name') || 
          key.toLowerCase().includes('age') ||
          key.toLowerCase().includes('dob')) {
        anonymized[key] = '[REDACTED]';
      } else {
        anonymized[key] = anonymizeForLogging(data[key]);
      }
    }
    return anonymized;
  }
  
  return data;
}