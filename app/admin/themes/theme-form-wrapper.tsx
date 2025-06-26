'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ThemeForm component to avoid import issues
const ThemeForm = dynamic(() => import('./theme-form').then(mod => ({ default: mod.ThemeForm })), {
  ssr: false,
  loading: () => <div className="p-4 bg-gray-50 rounded-lg"><p className="text-gray-600">Loading theme form...</p></div>
});

interface ThemeFormWrapperProps {
  tenant: any;
}

export function ThemeFormWrapper({ tenant }: ThemeFormWrapperProps) {
  return <ThemeForm tenant={tenant} />;
} 