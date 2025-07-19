import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    // 1. Create a new Stripe Express account (in production, fetch or reuse for the user/tenant)
    const account = await stripe.accounts.create({
      type: 'express',
    });

    // 2. Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://your-app.com/admin/payment-settings', // TODO: Replace with your real URL
      return_url: 'https://your-app.com/admin/payment-settings', // TODO: Replace with your real URL
      type: 'account_onboarding',
    });

    // 3. Return the onboarding URL to the frontend
    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe connect error:', error);
    return NextResponse.json({ error: 'Failed to create Stripe connect link.' }, { status: 500 });
  }
} 