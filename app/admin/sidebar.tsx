'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  FileText, 
  Users, 
  Home,
  Plus,
  Globe,
  Palette
} from 'lucide-react';

interface SidebarProps {
  hasTenants: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Subdomains', href: '/admin/subdomains', icon: Globe },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
];

const tenantNavigation = [
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Create Post', href: '/admin/blog/create', icon: Plus },
  { name: 'Theme Settings', href: '/admin/themes', icon: Palette },
];

export function Sidebar({ hasTenants }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            General
          </h3>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        {hasTenants && (
          <div className="space-y-1 pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Content
            </h3>
            {tenantNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          <p>Admin Panel v1.0</p>
        </div>
      </div>
    </div>
  );
} 