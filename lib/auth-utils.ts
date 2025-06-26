import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import prisma from "./prisma";

export interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session-token")?.value;
    
    if (!sessionToken) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return {
      ...session.user,
      name: session.user.name || undefined,
      image: session.user.image || undefined,
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

export async function createSession(userId: string, token: string): Promise<void> {
  await prisma.session.create({
    data: {
      id: token,
      token,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({
    where: { token },
  });
} 