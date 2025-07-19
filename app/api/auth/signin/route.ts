import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { signInSchema } from "@/lib/validations/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = signInSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
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
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user!.password!);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }


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
      user: userData,
      tenant: tenantData,
      hasTenant: !!user.tenant,
      redirectTo: user.tenant ? "/admin" : "/onboarding",
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
