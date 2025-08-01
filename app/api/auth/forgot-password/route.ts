import { NextRequest, NextResponse } from 'next/server';
import { createSession } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        tenant: {
          select: {
            id: true,
            name: true,
            subdomain: true,
            logoUrl: true,
            favicon: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Create session for login without password
    const sessionToken = crypto.randomUUID();
    await createSession(user.id, sessionToken);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Format user data for the hook
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      role: user.role as "admin" | "user" | "manager",
      isEmailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    // Format tenant data for the hook
    const tenantData = user.tenant
      ? {
          id: user.tenant.id,
          name: user.tenant.name,
          subdomain: user.tenant.subdomain,
          domain: "",
          logo: user.tenant.logoUrl || "",
          favicon: user.tenant.favicon,
          createdAt: user.tenant.createdAt.toISOString(),
          updatedAt: user.tenant.updatedAt.toISOString(),
        }
      : null;

    return NextResponse.json({
      success: true,
      message: 'Login successful without password verification.',
      user: userData,
      tenant: tenantData,
      hasTenant: !!user.tenant,
      redirectTo: user.tenant ? "/admin" : "/onboarding",
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 