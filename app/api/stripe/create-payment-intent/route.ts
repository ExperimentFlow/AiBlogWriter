import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subdomain, formData, amount, currency = 'usd' } = body;

    if (!subdomain || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find tenant by subdomain
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      include: {
        gatewaySetting: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    if (!tenant.isActive) {
      return NextResponse.json(
        { error: 'Tenant is not active' },
        { status: 403 }
      );
    }

    // Check if tenant has Stripe configured
    if (!tenant.gatewaySetting) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        subdomain,
        tenantId: tenant.id,
        customerEmail: formData.email || '',
        customerName: formData.name || '',
      },
      // If using connected accounts (for marketplace), uncomment:
      // stripeAccount: tenant.stripeAccountId,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 