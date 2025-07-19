'use client';

import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { useGallery } from '@/contexts/gallery-context';

interface AdminHeaderProps {
  user: {
    name?: string;
    email: string;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const { openGallery } = useGallery();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900"></h2>
        </div>
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={openGallery}
            className="flex items-center gap-2"
          >
            <Image className="h-4 w-4" />
            Gallery
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, {user.name || user.email} ({user.role})
          </span>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
} 