# Gallery Feature Setup Guide

## Overview
The gallery feature allows users to upload and manage media files (images, videos, documents) for their sites. It uses Cloudinary for file storage and optimization.

## Features
- ✅ **Image Upload** - Support for JPG, PNG, GIF, WebP
- ✅ **Video Upload** - Support for MP4, AVI, MOV, WMV, FLV, WebM
- ✅ **Document Upload** - Support for PDF, DOC, DOCX, TXT, ZIP, RAR
- ✅ **Drag & Drop** - Easy file upload interface
- ✅ **Metadata Support** - Alt text, descriptions, tags
- ✅ **Search & Filter** - Find files quickly
- ✅ **Grid/List Views** - Flexible display options
- ✅ **Copy URLs** - Easy sharing of media files
- ✅ **Tenant Isolation** - Each user sees only their files

## Cloudinary Setup

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Get your credentials from the dashboard

### 2. Environment Variables
Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Cloudinary Configuration
The gallery automatically:
- Organizes files by tenant subdomain
- Optimizes images (max 1920x1080, auto quality)
- Supports multiple file formats
- Provides secure URLs

## Usage

### For Users
1. Navigate to **Media Gallery** in the admin panel
2. Click **Upload Media** button
3. Drag & drop files or click to browse
4. Add metadata (alt text, description, tags)
5. Click **Upload** to process files

### For Developers
The gallery includes:
- **Database Schema** - Media table with tenant relationships
- **API Routes** - Upload, fetch, delete endpoints
- **React Components** - Uploader, grid, manager
- **TypeScript Types** - Full type safety

## File Limits
- **Maximum Size**: 50MB per file
- **Image Formats**: JPG, JPEG, PNG, GIF, WebP
- **Video Formats**: MP4, AVI, MOV, WMV, FLV, WebM
- **Document Formats**: PDF, DOC, DOCX, TXT, ZIP, RAR

## Future Enhancements
- 🔄 **Video Processing** - Thumbnail generation, format conversion
- 🔄 **Image Editing** - Crop, resize, filters
- 🔄 **Bulk Operations** - Select multiple files
- 🔄 **Advanced Search** - Search by tags, date, size
- 🔄 **CDN Integration** - Faster global delivery
- 🔄 **File Versioning** - Keep multiple versions

## API Endpoints

### GET /api/gallery
Fetch all media items for the current user's tenant

### POST /api/gallery/upload
Upload a new media file with metadata

### DELETE /api/gallery/[id]
Delete a specific media item

## Database Schema
```sql
CREATE TABLE media (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  alt TEXT,
  description TEXT,
  tags TEXT,
  tenantId TEXT NOT NULL,
  uploadedBy TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
``` 