import { cookies } from "next/headers";
import prisma from "./prisma";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCurrentUser(): Promise<User & { tenantId?: string } | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session-token")?.value;
    
    if (!sessionToken) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { 
        user: {
          select:{
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            image: true,
            role: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
            tenant: {
              select:{
                id: true,
              }
            }
          }
        } 
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return {
      ...session.user,
      tenantId: session.user.tenant?.id,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  return user;
}

export async function createSession(userId: string, token: string, tenantId?: string): Promise<void> {
  await prisma.session.create({
    data: {
      id: token,
      token,
      userId,
      tenantId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({
    where: { token },
  });
} 

export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { userId },
    });
    
    return !!tenant;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export async function getCurrentUserWithOnboarding() {
  const user = await getCurrentUser();
  if (!user) return null;

  const hasOnboarding = await hasCompletedOnboarding(user.id);
  
  // Get tenant information if user has a tenant
  let tenant = null;
  if (user.tenantId) {
    tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      select: { id: true, subdomain: true, name: true },
    });
  }
  
  return {
    ...user,
    hasCompletedOnboarding: hasOnboarding,
    tenant,
  };
} 