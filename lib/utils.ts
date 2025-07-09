import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const protocol =
  process.env.NODE_ENV === 'production' ? 'https' : 'http';
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWebhookUrl(baseUrl: string = process.env.NEXTAUTH_URL || 'http://localhost:3000', gateway = 'stripe') {
  return `${baseUrl}/api/${gateway}/webhook`;
}