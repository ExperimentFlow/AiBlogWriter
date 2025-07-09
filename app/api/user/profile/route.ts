import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { profileUpdateSchema } from '@/lib/validations/auth';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, phone, avatar } = profileUpdateSchema.parse(body);

    // Combine firstName and lastName into name field
    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        ...(fullName && { name: fullName }),
        ...(avatar && { image: avatar }),
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            subdomain: true,
            logoUrl: true,
            favicon: true,
            primaryColor: true,
            secondaryColor: true,
            defaultLanguage: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Format response
    const userData = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.name?.split(' ')[0] || '',
      lastName: updatedUser.name?.split(' ').slice(1).join(' ') || '',
      phone: '', // Not in current schema
      avatar: updatedUser.image || '',
      role: updatedUser.role as 'admin' | 'user' | 'manager',
      isEmailVerified: updatedUser.emailVerified,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };

    const tenantData = updatedUser.tenant ? {
      id: updatedUser.tenant.id,
      name: updatedUser.tenant.name || '',
      subdomain: updatedUser.tenant.subdomain,
      domain: '', // Not in current schema
      logo: updatedUser.tenant.logoUrl || '',
      favicon: updatedUser.tenant.favicon,
      theme: {
        primaryColor: updatedUser.tenant.primaryColor || '#3b82f6',
        secondaryColor: updatedUser.tenant.secondaryColor || '#64748b',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        colorScheme: 'light' as const,
      },
      settings: {
        enableCheckout: true,
        enableAddons: true,
        enableCoupons: true,
        currency: 'USD',
        language: updatedUser.tenant.defaultLanguage,
      },
      createdAt: updatedUser.tenant.createdAt.toISOString(),
      updatedAt: updatedUser.tenant.updatedAt.toISOString(),
    } : null;

    return NextResponse.json({
      user: userData,
      tenant: tenantData,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 