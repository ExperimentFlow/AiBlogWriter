'use client';

import { useGallery } from '@/contexts/gallery-context';
import { Button } from '@/components/ui/button';
import { Image, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  user?: {
    name?: string;
    email: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  const { openGallery } = useGallery();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Platforms
          </Link>
        </div>

        {/* Center - Gallery Button */}
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

        {/* Right side - User menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{user.name || user.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
                
                <form action="/api/auth/signout" method="POST">
                  <Button variant="ghost" size="sm" type="submit">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 