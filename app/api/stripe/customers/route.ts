import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { StripeServiceFactory } from '@/lib/services/gateway/stripe';

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

    // Check if Stripe is configured
    const isConfigured = await StripeServiceFactory.isConfigured(tenantId);
    if (!isConfigured) {
      return NextResponse.json({ error: 'Stripe is not configured for this tenant' }, { status: 400 });
    }

    const body = await req.json();
    const { email, name, phone, address, metadata } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Create Stripe service instance
    const stripeService = await StripeServiceFactory.createForTenant(tenantId);

    // Create customer
    const customer = await stripeService.createCustomer({
      email,
      name,
      phone,
      address,
      metadata: {
        ...metadata,
        tenantId,
        createdBy: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        created: customer.created,
      },
      message: 'Customer created successfully',
    });
  } catch (error) {
    console.error('Create customer error:', error);
    return NextResponse.json({
      error: 'Failed to create customer',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
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

    // Check if Stripe is configured
    const isConfigured = await StripeServiceFactory.isConfigured(tenantId);
    if (!isConfigured) {
      return NextResponse.json({ error: 'Stripe is not configured for this tenant' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Create Stripe service instance
    const stripeService = await StripeServiceFactory.createForTenant(tenantId);

    // List customers
    const customers = await stripeService.listCustomers(limit);

    return NextResponse.json({
      success: true,
      customers: customers.map(customer => ({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        created: customer.created,
        metadata: customer.metadata,
      })),
      total: customers.length,
    });
  } catch (error) {
    console.error('List customers error:', error);
    return NextResponse.json({
      error: 'Failed to list customers',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 