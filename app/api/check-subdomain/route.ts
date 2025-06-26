import { NextRequest, NextResponse } from 'next/server';
import { checkSubdomainAvailability, sanitizeSubdomain } from '@/lib/tenants';

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
      'www', 'api', 'admin', 'mail', 'ftp', 'blog', 'shop', 'store',
      'app', 'dev', 'test', 'staging', 'prod', 'cdn', 'static'
    ];

    if (reservedSubdomains.includes(sanitizedSubdomain)) {
      return NextResponse.json({
        available: false,
        error: 'This subdomain is reserved and cannot be used'
      });
    }

    const isAvailable = await checkSubdomainAvailability(sanitizedSubdomain);

    return NextResponse.json({
      available: isAvailable,
      subdomain: sanitizedSubdomain
    });
  } catch (error) {
    console.error('Error checking subdomain availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 