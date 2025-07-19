import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { config, name, description } = body;

    if (!config) {
      return NextResponse.json({ error: 'Configuration is required' }, { status: 400 });
    }

    
    if (!currentUser?.tenantId) {
      return NextResponse.json({ error: 'No tenant found for user' }, { status: 404 });
    }

    // Check if a configuration already exists for this tenant
    const existingConfig = await prisma.CheckoutConfig.findUnique({
      where: { tenantId: currentUser.tenantId }
    });

    let savedConfig;

    console.log("existingConfig", existingConfig);

    if (existingConfig) {
      // Update existing configuration
      savedConfig = await prisma.CheckoutConfig.update({
        where: { id: existingConfig.id },
        data: {
          name: name || existingConfig.name,
          description: description || existingConfig.description,
          config: config,
          version: (parseFloat(existingConfig.version) + 0.1).toFixed(1),
          updatedAt: new Date()
        }
      });
    } else {
      // Create new configuration
      savedConfig = await prisma.CheckoutConfig.create({
        data: {
          name: name || 'Checkout Configuration',
          description: description || 'Checkout builder configuration',
          config: config,
          version: '1.0.0',
          tenantId: currentUser.tenantId,
          createdBy: currentUser.id
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: savedConfig,
      message: existingConfig ? 'Configuration updated successfully' : 'Configuration saved successfully'
    });

  } catch (error) {
    console.error('Error saving checkout builder config:', error);
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!currentUser?.tenantId) {
      return NextResponse.json({ error: 'No tenant found for user' }, { status: 404 });
    }

    // Get the configuration for this tenant
    const config = await prisma.checkoutBuilderConfig.findUnique({
      where: { tenantId: currentUser.tenantId }
    });

    if (!config) {
      return NextResponse.json({ error: 'No configuration found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: config
    });

  } catch (error) {
    console.error('Error fetching checkout builder config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
} 