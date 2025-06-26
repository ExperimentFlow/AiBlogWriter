import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token')?.value;

    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    // Clear the session cookie
    cookieStore.delete('session-token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sign-out error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 