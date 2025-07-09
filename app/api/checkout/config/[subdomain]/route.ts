import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  try {
    const { subdomain } = params;

    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 });
    }

    // Find tenant by subdomain
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      include: {
        checkoutConfig: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    if (!tenant.isActive) {
      return NextResponse.json({ error: 'Tenant is not active' }, { status: 403 });
    }

    if (!tenant.checkoutConfig) {
      return NextResponse.json({ config: null });
    }

    return NextResponse.json({ config: tenant.checkoutConfig });
  } catch (error) {
    console.error('Error fetching checkout config by subdomain:', error);
    return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
  }
} 