import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';
import { productCreateSchema, productCreateSchemaWithValidation } from '@/lib/validations/product';
import { generateSlug, generateUniqueSlug } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!currentUser.tenantId) {
      return NextResponse.json({ error: 'No tenant found for user' }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: {
        tenantId: currentUser.tenantId,
      },
      include: {
        prices: {
          where: {
            deletedAt: null, // Only include non-deleted prices
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      products,
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

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
    const validationResult = productCreateSchemaWithValidation.safeParse(body);
    
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

    const { name, slug, description, imageUrl, isActive, prices } = validationResult.data;

    // Check if slug is unique for this tenant
    const existingProduct = await prisma.product.findFirst({
      where: { 
        tenantId: currentUser.tenantId,
        slug: slug
      },
    });
    
    if (existingProduct) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: [{ field: 'slug', message: 'Slug already exists for this tenant' }]
      }, { status: 400 });
    }

    // If no default price is set, make the first one default
    const defaultPrices = prices.filter((p: any) => p.isDefault);
    const pricesWithDefault = prices.map((price: any, index: number) => ({
      ...price,
      isDefault: defaultPrices.length === 0 ? index === 0 : price.isDefault,
    }));

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug,
        description,
        imageUrl,
        isActive,
        tenantId: currentUser.tenantId,
        createdBy: currentUser.id,
        prices: {
          create: pricesWithDefault.map((price: any) => ({
            name: price.name,
            price: price.price,
            type: price.type,
            interval: price.interval,
            intervalCount: price.intervalCount,
            isDefault: price.isDefault,
            isActive: price.isActive !== false,
          })),
        },
      },
      include: {
        prices: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully',
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 