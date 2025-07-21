import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';
import { z } from 'zod';

// Validation schemas
const checkoutConfigCreateSchema = z.object({
  config: z.any(),
  name: z.string().min(1, 'Name is required'),
  version: z.string().optional().default('1.0.0'),
  productId: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
});

const checkoutConfigUpdateSchema = z.object({
  id: z.string(),
  config: z.any(),
  name: z.string().min(1, 'Name is required'),
  version: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!currentUser.tenantId) {
      return NextResponse.json({ error: 'No tenant found for user' }, { status: 404 });
    }

    const body = await request.json();
    
    // Validate the request body using Zod
    const validationResult = checkoutConfigCreateSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json({ 
        error: 'Validation failed',
        details: errors
      }, { status: 400 });
    }

    const { config, name, version, productId, isDefault } = validationResult.data;

    // If this is set as default, unset other defaults for this tenant
    if (isDefault) {
      await prisma.checkoutConfig.updateMany({
        where: { 
          tenantId: currentUser.tenantId,
          isDefault: true 
        },
        data: { isDefault: false }
      });
    }

    // Check if config with same name exists for this tenant and product
    const existingConfig = await prisma.checkoutConfig.findFirst({
      where: {
        tenantId: currentUser.tenantId,
        productId: productId || null,
        name: name
      }
    });

    let checkoutConfig;

    if (existingConfig) {
      // Update existing config
      checkoutConfig = await prisma.checkoutConfig.update({
        where: { id: existingConfig.id },
        data: {
          config,
          version: version || '1.0.0',
          isDefault: isDefault || false,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new config
      checkoutConfig = await prisma.checkoutConfig.create({
        data: {
          name: name,
          version: version || '1.0.0',
          config,
          isDefault: isDefault || false,
          productId: productId || null,
          tenantId: currentUser.tenantId
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: checkoutConfig 
    });

  } catch (error) {
    console.error('Error saving checkout config:', error);
    return NextResponse.json(
      { error: 'Failed to save checkout configuration' }, 
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

    if (!currentUser.tenantId) {
      return NextResponse.json({ error: 'No tenant found for user' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const configId = searchParams.get('id');

    let checkoutConfig;

    if (configId) {
      // Load specific config by ID
      checkoutConfig = await prisma.checkoutConfig.findFirst({
        where: { 
          id: configId,
          tenantId: currentUser.tenantId 
        }
      });
    } else if (productId) {
      // Load product-specific config, fallback to default
      checkoutConfig = await prisma.checkoutConfig.findFirst({
        where: { 
          tenantId: currentUser.tenantId,
          productId: productId,
          isActive: true 
        },
        orderBy: { isDefault: 'desc' }
      });

      // If no product-specific config, get the default config
      if (!checkoutConfig) {
        checkoutConfig = await prisma.checkoutConfig.findFirst({
          where: { 
            tenantId: currentUser.tenantId,
            productId: null,
            isDefault: true,
            isActive: true 
          }
        });
      }
    } else {
      // Load default config
      checkoutConfig = await prisma.checkoutConfig.findFirst({
        where: { 
          tenantId: currentUser.tenantId,
          isDefault: true,
          isActive: true 
        }
      });
    }

    if (!checkoutConfig) {
      return NextResponse.json({ error: 'Checkout configuration not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: checkoutConfig 
    });

  } catch (error) {
    console.error('Error loading checkout config:', error);
    return NextResponse.json(
      { error: 'Failed to load checkout configuration' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!currentUser.tenantId) {
      return NextResponse.json({ error: 'No tenant found for user' }, { status: 404 });
    }

    const body = await request.json();
    
    // Validate the request body using Zod
    const validationResult = checkoutConfigUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json({ 
        error: 'Validation failed',
        details: errors
      }, { status: 400 });
    }

    const { id, config, name, version, isDefault } = validationResult.data;

    // Verify the config belongs to this tenant
    const existingConfig = await prisma.checkoutConfig.findFirst({
      where: { 
        id,
        tenantId: currentUser.tenantId 
      }
    });

    if (!existingConfig) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // If this is set as default, unset other defaults for this tenant
    if (isDefault) {
      await prisma.checkoutConfig.updateMany({
        where: { 
          tenantId: currentUser.tenantId,
          isDefault: true 
        },
        data: { isDefault: false }
      });
    }

    // Update the checkout config
    const updatedConfig = await prisma.checkoutConfig.update({
      where: { id },
      data: {
        config,
        name: name || existingConfig.name,
        version: version || existingConfig.version,
        isDefault: isDefault || false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedConfig 
    });

  } catch (error) {
    console.error('Error updating checkout config:', error);
    return NextResponse.json(
      { error: 'Failed to update checkout configuration' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!currentUser.tenantId) {
      return NextResponse.json({ error: 'No tenant found for user' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('id');

    if (!configId) {
      return NextResponse.json({ error: 'Configuration ID is required' }, { status: 400 });
    }

    // Verify the config belongs to this tenant and delete it
    const deletedConfig = await prisma.checkoutConfig.deleteMany({
      where: { 
        id: configId,
        tenantId: currentUser.tenantId 
      }
    });

    if (deletedConfig.count === 0) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Configuration deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting checkout config:', error);
    return NextResponse.json(
      { error: 'Failed to delete checkout configuration' }, 
      { status: 500 }
    );
  }
} 