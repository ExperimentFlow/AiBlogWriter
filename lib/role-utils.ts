import { User } from './auth-utils';

export type UserRole = 'owner' | 'user';

export function isOwner(user: User | null): boolean {
  return user?.role === 'owner';
}

export function isUser(user: User | null): boolean {
  return user?.role === 'user';
}

export function requireOwner(user: User | null): void {
  if (!isOwner(user)) {
    throw new Error('Owner access required');
  }
}

export function requireUser(user: User | null): void {
  if (!user) {
    throw new Error('Authentication required');
  }
}

export function canAccessAdmin(user: User | null): boolean {
  return isOwner(user);
}

export function canCreateTenant(user: User | null): boolean {
  return isOwner(user);
}

export function canManageTenant(user: User | null, tenantUserId?: string): boolean {
  if (!user) return false;
  
  // Owners can manage any tenant
  if (isOwner(user)) return true;
  
  // Users can only manage their own tenants
  return user.id === tenantUserId;
} 