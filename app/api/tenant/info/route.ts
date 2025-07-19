import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = user.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant associated with this session' }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        subdomain: true,
        name: true,
        description: true,
        favicon: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        defaultLanguage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({ tenant });
  } catch (error) {
    console.error('Error fetching tenant info:', error);
    return NextResponse.json({ error: 'Failed to fetch tenant information' }, { status: 500 });
  }
} 