import { NextRequest, NextResponse } from 'next/server';
import { getAllTenants } from '@/lib/tenants';
import { getCurrentUser } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tenants = await getAllTenants();
    
    return NextResponse.json({
      success: true,
      tenants: tenants.map(tenant => ({
        id: tenant.id,
        subdomain: tenant.subdomain,
        name: tenant.name,
        emoji: tenant.emoji,
        description: tenant.description,
        isActive: tenant.isActive,
        defaultLanguage: (tenant as any).defaultLanguage || 'en',
        supportedLanguages: (tenant as any).supportedLanguages || ['en'],
      }))
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
} 