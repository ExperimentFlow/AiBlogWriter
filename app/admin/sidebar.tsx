'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { protocol, rootDomain } from '@/lib/utils';
import { 
  Settings, 
  FileText, 
  Users, 
  Home,
  Plus,
  TrendingUp,
  Palette,
  BarChart3,
  Globe,
  CreditCard,
  ExternalLink,
  ShoppingCart,
  Eye,
  GitBranch,
  Package
} from 'lucide-react';

interface SidebarProps {
  hasTenants: boolean;
  tenant?: { id: string; subdomain: string; name: string | null } | null;
}

const navigation = [
  { name: 'Analytics Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Payment Settings', href: '/admin/payment-settings', icon: CreditCard },
  { name: 'Checkout Builder', href: '/admin/checkout-builder', icon: ShoppingCart },
  { name: 'Checkout Demo', href: '/admin/checkout-demo', icon: Eye },
  { name: 'Checkout Flow', href: '/admin/checkout-flow', icon: GitBranch },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar({ hasTenants, tenant }: SidebarProps) {
  const pathname = usePathname();

  const getTenantUrl = () => {
    if (!tenant) return null;
    return `${protocol}://${tenant.subdomain}.${rootDomain}`;
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">Blog Admin</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Blog Management
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
          
          {/* Visit Site Option */}
          {tenant && (
            <a
              href={getTenantUrl() || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <ExternalLink className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
              Visit Site
            </a>
          )}
        </div>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          <p>Blog Admin v1.0</p>
        </div>
      </div>
    </div>
  );
} 