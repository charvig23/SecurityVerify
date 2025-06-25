# SecureVerify - Identity Verification System

## Overview

SecureVerify is a modern full-stack web application that provides secure age and identity verification using OCR (Optical Character Recognition) technology and facial recognition. The system allows users to upload identification documents, capture selfies, and get verified through automated document processing and face matching.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI primitives with custom styling
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **File Handling**: Multer for multipart form uploads
- **OCR Processing**: Tesseract.js for text extraction
- **Image Processing**: Sharp for image optimization

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **File Storage**: Local filesystem (uploads directory)
- **Session Storage**: In-memory storage (development) with PostgreSQL session store support
- **Schema Management**: Drizzle Kit for migrations and schema management

## Key Components

### Database Schema
- **Users Table**: Basic user authentication (username, password)
- **Verification Records Table**: Comprehensive verification tracking including:
  - Document and selfie file paths
  - Extracted information (name, age, date of birth)
  - Face matching scores (0-100)
  - Verification status flags
  - Processing timestamps

### Frontend Components
- **Document Upload**: Drag-and-drop file upload with preview and validation
- **Selfie Capture**: Webcam integration for real-time photo capture
- **Progress Indicator**: Multi-step verification process visualization
- **Verification Results**: Real-time status updates and result display

### Backend Services
- **OCR Processing**: Document text extraction with preprocessing for accuracy
- **Image Processing**: File optimization and format conversion
- **Face Comparison**: Placeholder implementation for facial matching
- **File Management**: Secure upload handling with type validation

## Data Flow

1. **Document Upload**: User uploads ID document → Server processes with OCR → Extracts personal information
2. **Selfie Capture**: User captures selfie → Uploads to server → Stores for comparison
3. **Verification Processing**: Server compares document photo with selfie → Calculates match score
4. **Results Display**: Real-time polling for verification status → Display results to user

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **tesseract.js**: OCR text extraction
- **sharp**: High-performance image processing
- **multer**: File upload middleware
- **react-webcam**: Camera integration

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **tailwindcss**: CSS framework
- **class-variance-authority**: CSS class utilities
- **lucide-react**: Icon library

## Deployment Strategy

### Development Environment
- **Runtime**: Replit with Node.js 20
- **Database**: PostgreSQL 16 module
- **Development Server**: Vite dev server on port 5000
- **Hot Reload**: Enabled with runtime error overlay

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Deployment**: Replit Autoscale with external port 80
- **Process Management**: npm scripts for development and production

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **File Storage**: Local uploads directory (ephemeral in Replit)
- **Session Management**: Connect-pg-simple for production session storage

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
- June 25, 2025. Enhanced age verification with MagicAPI integration
  - Added selfie age estimation using computer vision
  - Dual age verification (ID OCR + selfie analysis)
  - Face match threshold set to 65%
  - Updated database schema with selfieEstimatedAge field
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```