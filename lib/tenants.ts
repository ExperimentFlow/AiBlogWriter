import { PrismaClient } from '@prisma/client';
import prisma from './prisma';
// import { getTheme, ThemeConfig } from './themes';
import { getDefaultSupportedLanguages } from './localization';

// Simple default theme configuration
const defaultThemeConfig = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    text: '#1f2937',
    textSecondary: '#6b7280',
    surface: '#ffffff',
  },
  gradients: {
    hero: 'from-blue-50 to-indigo-100',
  },
  fonts: {
    heading: 'font-bold',
  },
};

export function isValidIcon(str: string) {
  return /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]$/u.test(str);
}

export function sanitizeSubdomain(subdomain: string): string {
  return subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

export async function getTenantBySubdomain(subdomain: string) {
  const sanitizedSubdomain = sanitizeSubdomain(subdomain);
  
  return await prisma.tenant.findUnique({
    where: { subdomain: sanitizedSubdomain },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });
}

export async function getAllTenants() {
  return await prisma.tenant.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getTenantsByUserId(userId: string) {
  return await prisma.tenant.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function createTenant(
  data: {
    subdomain: string;
    name?: string;
    favicon: string;
    description?: string;
    userId: string;
    defaultLanguage?: string;
    supportedLanguages?: string[];
  }
) {
  const sanitizedSubdomain = sanitizeSubdomain(data.subdomain);
  
  return await prisma.tenant.create({
    data: {
      subdomain: sanitizedSubdomain,
      name: data.name,
      favicon: data.favicon,
      description: data.description,
      userId: data.userId,
      defaultLanguage: data.defaultLanguage || 'en',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });
}

export async function updateTenant(
  id: string,
  data: {
    name?: string;
    favicon?: string;
    description?: string;
    isActive?: boolean;
    theme?: string;
    themeConfig?: any;
    defaultLanguage?: string;
    supportedLanguages?: string[];
  }
) {
  return await prisma.tenant.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });
}

export async function deleteTenant(id: string) {
  return await prisma.tenant.delete({
    where: { id },
  });
}

export async function isSubdomainAvailable(subdomain: string): Promise<boolean> {
  const sanitizedSubdomain = sanitizeSubdomain(subdomain);
  
  const existingTenant = await prisma.tenant.findUnique({
    where: { subdomain: sanitizedSubdomain },
  });
  
  return !existingTenant;
}

export async function updateTenantTheme(tenantId: string, themeId: string) {
  // const theme = getTheme(themeId);
  
  return await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      theme: themeId,
      // themeConfig: theme,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });
}

export async function getTenantWithTheme(subdomain: string) {
  const sanitizedSubdomain = sanitizeSubdomain(subdomain);
  
  const tenant = await prisma.tenant.findUnique({
    where: { subdomain: sanitizedSubdomain },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });

  if (!tenant) return null;

  return {
    ...tenant,
    themeConfig: defaultThemeConfig,
  };
}

export async function getTenantWithLocalization(subdomain: string, language?: string) {
  const sanitizedSubdomain = sanitizeSubdomain(subdomain);
  
  const tenant = await prisma.tenant.findUnique({
    where: { subdomain: sanitizedSubdomain },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });

  if (!tenant) return null;

  // Determine the language to use
  const supportedLanguages = ((tenant as any).supportedLanguages as string[]) || getDefaultSupportedLanguages();
  const defaultLanguage = (tenant as any).defaultLanguage || 'en';
  const currentLanguage = language && supportedLanguages.includes(language) ? language : defaultLanguage;
  
  return {
    ...tenant,
    themeConfig: defaultThemeConfig,
    currentLanguage,
    supportedLanguages,
    defaultLanguage,
  };
} 