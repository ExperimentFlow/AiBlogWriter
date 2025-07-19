import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';
import { productUpdateApiSchema, productSchemaWithValidation } from '@/lib/validations/product';
import { generateSlug, generateUniqueSlug } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!currentUser.tenantId) {
      return NextResponse.json({ error: 'No tenant found for user' }, { status: 404 });
    }

    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        id,
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
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!currentUser.tenantId) {
      return NextResponse.json({ error: 'No tenant found for user' }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Check if product exists and belongs to user's tenant
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Validate the request body using Zod
    const validationResult = productSchemaWithValidation.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json({ 
        error: 'Validation failed',
        details: errors
      }, { status: 400 });
    }

    const { name, slug, description, imageUrl, isActive, prices } = validationResult.data;

    // Check if slug is unique for this tenant (excluding current product)
    const existingProductWithSlug = await prisma.product.findFirst({
      where: { 
        tenantId: currentUser.tenantId,
        slug: slug,
        id: { not: id } // Exclude current product
      },
    });
    
    if (existingProductWithSlug) {
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

    // Update product and prices in a transaction
    const product = await prisma.$transaction(async (tx: any) => {
      // Update product
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          name,
          slug: slug,
          description,
          imageUrl,
          isActive,
        },
      });

      // Soft delete existing prices (set deletedAt timestamp)
      await tx.productPrice.updateMany({
        where: { 
          productId: id,
          deletedAt: null, // Only update non-deleted prices
        },
        data: {
          deletedAt: new Date(),
        },
      });

      // Create new prices
      const newPrices = await tx.productPrice.createMany({
        data: pricesWithDefault.map((price: any) => ({
          productId: id,
          name: price.name,
          price: price.price,
          type: price.type,
          interval: price.interval,
          intervalCount: price.intervalCount,
          isDefault: price.isDefault,
          isActive: price.isActive !== false,
        })),
      });

      return updatedProduct;
    });

    // Fetch updated product with prices
    const updatedProductWithPrices = await prisma.product.findUnique({
      where: { id },
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
    });

    return NextResponse.json({
      success: true,
      product: updatedProductWithPrices,
      message: 'Product updated successfully',
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!currentUser.tenantId) {
      return NextResponse.json({ error: 'No tenant found for user' }, { status: 404 });
    }

    const { id } = await params;

    // Check if product exists and belongs to user's tenant
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        tenantId: currentUser.tenantId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete product (prices will be deleted automatically due to cascade)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 