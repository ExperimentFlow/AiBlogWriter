import { NextRequest, NextResponse } from 'next/server';
import { sanitizeSubdomain, isSubdomainAvailable } from '@/lib/tenants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain parameter is required' },
        { status: 400 }
      );
    }

    return await checkSubdomainAvailability(subdomain);
  } catch (error) {
    console.error('Error checking subdomain availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subdomain } = body;

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain parameter is required' },
        { status: 400 }
      );
    }

    return await checkSubdomainAvailability(subdomain);
  } catch (error) {
    console.error('Error checking subdomain availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function checkSubdomainAvailability(subdomain: string) {
  const sanitizedSubdomain = sanitizeSubdomain(subdomain);
  
  // Basic validation
  if (sanitizedSubdomain.length < 3) {
    return NextResponse.json({
      available: false,
      error: 'Subdomain must be at least 3 characters long'
    });
  }

  if (sanitizedSubdomain.length > 63) {
    return NextResponse.json({
      available: false,
      error: 'Subdomain must be less than 63 characters long'
    });
  }

  // Check if it's a reserved subdomain
  const reservedSubdomains = [
    'www', 'api', 'admin', 'mail', 'ftp', 'shop', 'store',
    'app', 'dev', 'test', 'staging', 'prod', 'cdn', 'static', 's',
    'auth', 'login', 'signup', 'signin', 'signout', 'dashboard',
    'onboarding', 'settings', 'profile', 'account', 'billing',
    'support', 'help', 'docs', 'status', 'health', 'metrics'
  ];

  if (reservedSubdomains.includes(sanitizedSubdomain)) {
    return NextResponse.json({
      available: false,
      error: 'This subdomain is reserved and cannot be used'
    });
  }

  // Check if subdomain contains invalid characters
  if (!/^[a-z0-9-]+$/.test(sanitizedSubdomain)) {
    return NextResponse.json({
      available: false,
      error: 'Subdomain can only contain lowercase letters, numbers, and hyphens'
    });
  }

  // Check if subdomain starts or ends with hyphen
  if (sanitizedSubdomain.startsWith('-') || sanitizedSubdomain.endsWith('-')) {
    return NextResponse.json({
      available: false,
      error: 'Subdomain cannot start or end with a hyphen'
    });
  }

  // Check availability in database
  const available = await isSubdomainAvailable(sanitizedSubdomain);

  return NextResponse.json({
    available,
    subdomain: sanitizedSubdomain
  });
} 