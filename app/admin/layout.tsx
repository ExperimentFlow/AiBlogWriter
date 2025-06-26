import { Sidebar } from './sidebar';
import { getAllTenants } from '@/lib/tenants';
import { getCurrentUser } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/signin');
  }

  const tenants = await getAllTenants();
  const hasTenants = tenants.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar hasTenants={hasTenants} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.name || user.email}
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
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 