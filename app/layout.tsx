import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { GalleryProvider } from '@/contexts/gallery-context';
import { UserProvider } from '@/contexts/UserContext';
import { GalleryModal } from '@/components/gallery-modal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Platforms Starter Kit',
  description: 'Next.js template for building a multi-tenant SaaS.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        <UserProvider>
          <GalleryProvider>
            {children}
            <GalleryModal />
          </GalleryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
