/// <reference types="node" />

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { Buffer } from 'buffer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/json', 'text/markdown'];
const ALLOWED_EXTENSIONS = ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.mp4', '.webm', '.ogg', '.pdf', '.txt', '.md', '.json'];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;

    // --- Validation ---
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 50MB.' }, { status: 400 });
    }
    const fileName = file.name.toLowerCase();
    const isAllowedType = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_FILE_TYPES].includes(file.type);
    const isAllowedExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!isAllowedType || !isAllowedExt) {
      return NextResponse.json({ error: 'File type not allowed.' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine file type
    let fileType: 'image' | 'video' | 'file' = 'file';
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
      fileType = 'image';
    } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      fileType = 'video';
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `platforms/users/${user.id}`,
          resource_type: fileType === 'video' ? 'video' : 'auto',
          allowed_formats: fileType === 'image' ? ['jpg', 'jpeg', 'png', 'gif', 'webp'] : 
                          fileType === 'video' ? ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'] : 
                          ['pdf', 'doc', 'docx', 'txt', 'zip', 'rar'],
          transformation: fileType === 'image' ? [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ] : undefined,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      (uploadStream as any).end(buffer);
    }) as any;

    // Get file dimensions for images
    let width: number | undefined;
    let height: number | undefined;
    let duration: number | undefined;

    if (fileType === 'image' && uploadResult.width && uploadResult.height) {
      width = uploadResult.width;
      height = uploadResult.height;
    } else if (fileType === 'video' && uploadResult.duration) {
      duration = Math.round(uploadResult.duration);
    }

    // Save to database
    const mediaItem = await prisma.media.create({
      data: {
        name: file.name,
        url: uploadResult.secure_url,
        type: fileType,
        size: file.size,
        width,
        height,
        duration,
        alt: alt || undefined,
        description: description || undefined,
        tags: tags || undefined,
        userId: user.id,
        tenantId: null,
        uploadedBy: user.name || user.email,
      }
    });

    return NextResponse.json({
      success: true,
      media: {
        id: mediaItem.id,
        name: mediaItem.name,
        url: mediaItem.url,
        type: mediaItem.type,
        size: mediaItem.size,
        width: mediaItem.width,
        height: mediaItem.height,
        duration: mediaItem.duration,
        alt: mediaItem.alt,
        description: mediaItem.description,
        tags: mediaItem.tags ? mediaItem.tags.split(',').map((tag: any) => tag.trim()) : [],
        tenantId: mediaItem.tenantId,
        uploadedBy: mediaItem.uploadedBy,
        createdAt: mediaItem.createdAt,
        updatedAt: mediaItem.updatedAt,
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 