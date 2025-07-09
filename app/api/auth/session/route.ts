import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }

    // Get user with tenant information
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Format response
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      phone: '', // Not in current schema
      avatar: user.image || '',
      role: user.role as 'admin' | 'user' | 'manager',
      isEmailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    const tenantData = user.tenant ? {
      id: user.tenant.id,
      name: user.tenant.name || '',
      subdomain: user.tenant.subdomain,
      domain: '', // Not in current schema
      logo: user.tenant.logoUrl || '',
      favicon: user.tenant.favicon,
      theme: {
        primaryColor: user.tenant.primaryColor || '#3b82f6',
        secondaryColor: user.tenant.secondaryColor || '#64748b',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        colorScheme: 'light' as const,
      },
      settings: {
        enableCheckout: true,
        enableAddons: true,
        enableCoupons: true,
        currency: 'USD',
        language: user.tenant.defaultLanguage,
      },
      createdAt: user.tenant.createdAt.toISOString(),
      updatedAt: user.tenant.updatedAt.toISOString(),
    } : null;

    return NextResponse.json({
      user: userData,
      tenant: tenantData,
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 