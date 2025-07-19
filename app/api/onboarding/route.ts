import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const onboardingSchema = z.object({
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(63, 'Subdomain must be less than 63 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
    .refine(val => !val.startsWith('-') && !val.endsWith('-'), 'Subdomain cannot start or end with a hyphen'),
  subtitle: z.string()
    .min(1, 'Subtitle is required')
    .max(100, 'Subtitle must be less than 100 characters'),
  favicon: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subdomain, subtitle, favicon } = onboardingSchema.parse(body);

    // Check if subdomain is available
    const existingTenant = await prisma.tenant.findUnique({
      where: { subdomain },
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Subdomain is already taken' },
        { status: 409 }
      );
    }

    // Check if user already has a tenant
    const existingUserTenant = await prisma.tenant.findFirst({
      where: { userId: user.id },
    });

    if (existingUserTenant) {
      return NextResponse.json(
        { error: 'User already has a site' },
        { status: 400 }
      );
    }

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        subdomain,
        name: subtitle,
        description: subtitle,
        favicon: favicon || '🚀', // Default favicon if none provided
        userId: user.id,
        isActive: true,
        theme: 'default',
        themeConfig: {
          favicon: favicon || null,
        },
      },
    });

    // Update the current session with tenantId
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token')?.value;
    
    if (sessionToken) {
      await prisma.session.update({
        where: { token: sessionToken },
        data: { tenantId: tenant.id },
      });
    }

    // Format tenant data for the useUser hook
    const tenantData = {
      id: tenant.id,
      name: tenant.name || '',
      subdomain: tenant.subdomain,
      domain: '', // Not in current schema
      logo: '', // Will be set later
      favicon: tenant.favicon,
      theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        colorScheme: 'light' as const,
      },
      settings: {
        enableCheckout: true,
        enableAddons: true,
        enableCoupons: true,
        currency: 'USD',
        language: 'en',
      },
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      tenant: tenantData,
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
} 