import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth-utils';
import { cookies } from 'next/headers';
import { signUpSchema } from '@/lib/validations/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = signUpSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password, // In production, hash this password
        name,
      },
    });

    // Create session
    const sessionToken = crypto.randomUUID();
    await createSession(user.id, sessionToken);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
} 