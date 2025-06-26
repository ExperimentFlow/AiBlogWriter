'use client';

import dynamic from 'next/dynamic';

// Dynamically import the QuickThemeSelector component
const QuickThemeSelector = dynamic(() => import('./quick-theme-selector').then(mod => ({ default: mod.QuickThemeSelector })), {
  ssr: false,
  loading: () => <div className="w-48 h-8 bg-gray-100 rounded animate-pulse"></div>
});

interface QuickThemeSelectorWrapperProps {
  tenant: any;
  className?: string;
}

export function QuickThemeSelectorWrapper({ tenant, className = '' }: QuickThemeSelectorWrapperProps) {
  return <QuickThemeSelector tenant={tenant} className={className} />;
} 