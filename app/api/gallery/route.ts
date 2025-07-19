import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get media items for the user
    const mediaItems = await prisma.media.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      media: mediaItems.map(item => ({
        id: item.id,
        name: item.name,
        url: item.url,
        type: item.type,
        size: item.size,
        width: item.width,
        height: item.height,
        duration: item.duration,
        alt: item.alt,
        description: item.description,
        tags: item.tags ? item.tags.split(',').map(tag => tag.trim()) : [],
        tenantId: item.tenantId,
        uploadedBy: item.uploadedBy,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))
    });
  } catch (error) {
    console.error('Error fetching media items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media items' },
      { status: 500 }
    );
  }
} 