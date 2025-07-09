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
    const { 
      amount, 
      currency, 
      customerId, 
      paymentMethodId, 
      description, 
      metadata,
      automaticPaymentMethods = true,
      confirm = false,
      returnUrl 
    } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    if (!currency) {
      return NextResponse.json({ error: 'Currency is required' }, { status: 400 });
    }

    // Create Stripe service instance
    const stripeService = await StripeServiceFactory.createForTenant(tenantId);

    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customerId,
      paymentMethodId,
      description,
      metadata: {
        ...metadata,
        tenantId,
        createdBy: user.id,
      },
      automaticPaymentMethods,
      confirm,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret,
        customer: paymentIntent.customer,
        description: paymentIntent.description,
        metadata: paymentIntent.metadata,
        created: paymentIntent.created,
      },
      message: 'Payment intent created successfully',
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return NextResponse.json({
      error: 'Failed to create payment intent',
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

    const { searchParams } = new URL(req.url);
    const paymentIntentId = searchParams.get('id');

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment intent ID is required' }, { status: 400 });
    }

    // Check if Stripe is configured
    const isConfigured = await StripeServiceFactory.isConfigured(tenantId);
    if (!isConfigured) {
      return NextResponse.json({ error: 'Stripe is not configured for this tenant' }, { status: 400 });
    }

    // Create Stripe service instance
    const stripeService = await StripeServiceFactory.createForTenant(tenantId);

    // Get payment intent
    const paymentIntent = await stripeService.getPaymentIntent(paymentIntentId);

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        customer: paymentIntent.customer,
        description: paymentIntent.description,
        metadata: paymentIntent.metadata,
        created: paymentIntent.created,
        lastPaymentError: paymentIntent.last_payment_error,
      },
    });
  } catch (error) {
    console.error('Get payment intent error:', error);
    return NextResponse.json({
      error: 'Failed to get payment intent',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 