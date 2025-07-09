import { getCurrentUserWithOnboarding } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserWithOnboarding();
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Redirect to admin if user has already completed onboarding
  if (user.hasCompletedOnboarding) {
    redirect('/admin');
  }

  return <>{children}</>;
} 