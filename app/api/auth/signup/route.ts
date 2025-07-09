import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth-utils';
import { cookies } from 'next/headers';
import { signUpSchema } from '@/lib/validations/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = signUpSchema.parse(body);

   

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

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role
    const user = await prisma.user.create({
      data: {
        email,
        password : hashedPassword, 
        firstName,
        lastName,
        role: "admin"
      },
    });


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

    // Format user data for the hook
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      role: user.role,
      isEmailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };



    return NextResponse.json({
      success: true,
      user: userData,
      tenant: null,
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
} 