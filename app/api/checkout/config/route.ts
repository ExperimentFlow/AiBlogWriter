import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = user.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant associated with this session' }, { status: 400 });
    }

    const config = await req.json();

    // Check if checkout config exists for this tenant
    let checkoutConfig = await prisma.checkoutConfig.findUnique({
      where: { tenantId },
    });

    if (checkoutConfig) {
      // Update existing config
      checkoutConfig = await prisma.checkoutConfig.update({
        where: { tenantId },
        data: {
          title: config.title,
          description: config.description,
          fields: config.fields,
          showLogo: config.showLogo,
          logoUrl: config.logoUrl,
          primaryColor: config.primaryColor,
          buttonText: config.buttonText,
          successMessage: config.successMessage,
        },
      });
    } else {
      // Create new config
      checkoutConfig = await prisma.checkoutConfig.create({
        data: {
          tenantId,
          title: config.title,
          description: config.description,
          fields: config.fields,
          showLogo: config.showLogo,
          logoUrl: config.logoUrl,
          primaryColor: config.primaryColor,
          buttonText: config.buttonText,
          successMessage: config.successMessage,
        },
      });
    }

    return NextResponse.json({ success: true, config: checkoutConfig });
  } catch (error) {
    console.error('Error saving checkout config:', error);
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
  }
}

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

    const checkoutConfig = await prisma.checkoutConfig.findUnique({
      where: { tenantId },
    });

    if (!checkoutConfig) {
      return NextResponse.json({ config: null });
    }

    return NextResponse.json({ config: checkoutConfig });
  } catch (error) {
    console.error('Error fetching checkout config:', error);
    return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
  }
} 