'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Loader2, User, ExternalLink } from 'lucide-react';
import { deleteSubdomainAction } from '@/app/actions';
import { rootDomain, protocol } from '@/lib/utils';

type Tenant = {
  id: string;
  subdomain: string;
  emoji: string;
  name?: string;
  description?: string;
  isActive: boolean;
  createdAt: number;
  user: {
    id: string;
    name?: string;
    email: string;
  };
};

type DeleteState = {
  error?: string;
  success?: boolean;
  message?: string;
};

function TenantGrid({
  tenants,
  action,
  isPending
}: {
  tenants: Tenant[];
  action: (formData: FormData) => void;
  isPending: boolean;
}) {
  if (tenants.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subdomains yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first subdomain.</p>
          <Button asChild>
            <a href="/">Create Subdomain</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Subdomains</h2>
        <Button variant="outline" asChild>
          <a href="/">Create New</a>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{tenant.subdomain}</CardTitle>
                  {tenant.name && (
                    <p className="text-sm text-gray-600 mt-1">{tenant.name}</p>
                  )}
                </div>
                <form action={action}>
                  <input
                    type="hidden"
                    name="tenantId"
                    value={tenant.id}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="submit"
                    disabled={isPending}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">{tenant.emoji}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tenant.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {tenant.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {tenant.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {tenant.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>{tenant.user.name || tenant.user.email}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created: {new Date(tenant.createdAt).toLocaleDateString()}</span>
                <a
                  href={`${protocol}://${tenant.subdomain}.${rootDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  Visit <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboard({ tenants }: { tenants: Tenant[] }) {
  const [state, action, isPending] = useActionState<DeleteState, FormData>(
    deleteSubdomainAction,
    {}
  );

  return (
    <div className="space-y-6">
      <TenantGrid tenants={tenants} action={action} isPending={isPending} />

      {state.error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md z-50">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50">
          {state.success}
        </div>
      )}
    </div>
  );
}
