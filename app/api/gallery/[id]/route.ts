import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the media item
    const mediaItem = await prisma.media.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!mediaItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    try {
      const publicId = mediaItem.url.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: mediaItem.type === 'video' ? 'video' : 'image'
        });
      }
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await prisma.media.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Media item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting media item:', error);
    return NextResponse.json(
      { error: 'Failed to delete media item' },
      { status: 500 }
    );
  }
} 