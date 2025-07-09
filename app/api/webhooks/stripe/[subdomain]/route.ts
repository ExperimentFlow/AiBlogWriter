import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { safeDecrypt } from '@/lib/encryption';

export async function POST(
  req: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  try {
    const { subdomain } = params;
    
    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // Get tenant and their webhook secret
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      include: {
        gatewaySetting: true
      }
    });

    if (!tenant || !tenant.gatewaySetting) {
      return NextResponse.json({ error: 'Tenant or gateway settings not found' }, { status: 404 });
    }

    // Decrypt the webhook secret
    const webhookSecret = safeDecrypt(tenant.gatewaySetting.webhookSecret || '', 'payment-gateway');
    
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      // Verify the webhook signature
      event = Stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, tenant.id);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent, tenant.id);
        break;
      
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object as Stripe.Charge, tenant.id);
        break;
      
      case 'charge.failed':
        await handleChargeFailed(event.data.object as Stripe.Charge, tenant.id);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, tenant.id);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, tenant.id);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, tenant.id);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, tenant.id);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, tenant.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Event handlers
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent, tenantId: string) {
  console.log(`Payment succeeded for tenant ${tenantId}:`, paymentIntent.id);
  // Add your payment success logic here
  // e.g., update order status, send confirmation email, etc.
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent, tenantId: string) {
  console.log(`Payment failed for tenant ${tenantId}:`, paymentIntent.id);
  // Add your payment failure logic here
  // e.g., update order status, send failure notification, etc.
}

async function handleChargeSucceeded(charge: Stripe.Charge, tenantId: string) {
  console.log(`Charge succeeded for tenant ${tenantId}:`, charge.id);
  // Add your charge success logic here
}

async function handleChargeFailed(charge: Stripe.Charge, tenantId: string) {
  console.log(`Charge failed for tenant ${tenantId}:`, charge.id);
  // Add your charge failure logic here
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, tenantId: string) {
  console.log(`Subscription created for tenant ${tenantId}:`, subscription.id);
  // Add your subscription creation logic here
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, tenantId: string) {
  console.log(`Subscription updated for tenant ${tenantId}:`, subscription.id);
  // Add your subscription update logic here
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, tenantId: string) {
  console.log(`Subscription deleted for tenant ${tenantId}:`, subscription.id);
  // Add your subscription deletion logic here
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, tenantId: string) {
  console.log(`Invoice payment succeeded for tenant ${tenantId}:`, invoice.id);
  // Add your invoice payment success logic here
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, tenantId: string) {
  console.log(`Invoice payment failed for tenant ${tenantId}:`, invoice.id);
  // Add your invoice payment failure logic here
} 