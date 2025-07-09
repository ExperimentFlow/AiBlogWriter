import { Sidebar } from './sidebar';
import { getAllTenants } from '@/lib/tenants';
import { getCurrentUserWithOnboarding } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { AdminHeader } from './admin-header';
import { canAccessAdmin } from '@/lib/role-utils';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserWithOnboarding();
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Check if user has admin access (owner role)
  // if (!canAccessAdmin(user)) {
  //   redirect('/'); // Redirect to home page if not owner
  // }

  // Redirect to onboarding if user hasn't completed it
  if (!user.hasCompletedOnboarding) {
    redirect('/onboarding');
  }

  const tenants = await getAllTenants();
  const hasTenants = tenants.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar hasTenants={hasTenants} tenant={user.tenant} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader user={user} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 