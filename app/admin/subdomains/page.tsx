import { getAllTenants } from '@/lib/tenants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Search, Plus, User, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { rootDomain, protocol } from '@/lib/utils';
import { QuickThemeSelectorWrapper } from '../themes/quick-theme-selector-wrapper';

export default async function SubdomainsPage() {
  const tenants = await getAllTenants();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subdomain Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all subdomains on your platform
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            <Plus className="h-4 w-4 mr-2" />
            Create Subdomain
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Subdomains</p>
                <p className="text-2xl font-semibold text-gray-900">{tenants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tenants.filter((t: any) => t.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Globe className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tenants.filter((t: any) => !t.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(tenants.map((t: any) => t.user.id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find specific subdomains or filter by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Subdomains</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by subdomain, name, or user..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subdomains List */}
      <Card>
        <CardHeader>
          <CardTitle>All Subdomains</CardTitle>
          <CardDescription>
            {tenants.length} subdomain{tenants.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenants.map((tenant: any) => (
              <div
                key={tenant.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{tenant.favicon}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">
                        {tenant.subdomain}.{rootDomain}
                      </h3>
                      <Badge 
                        variant={tenant.isActive ? 'default' : 'secondary'}
                      >
                        {tenant.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {tenant.name && (
                      <p className="text-sm text-gray-600 mt-1">{tenant.name}</p>
                    )}
                    {tenant.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {tenant.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {tenant.user.name || tenant.user.email}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(tenant.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <QuickThemeSelectorWrapper tenant={tenant} />
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`${protocol}://${tenant.subdomain}.${rootDomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {tenants.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Globe className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subdomains found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first subdomain.</p>
              <Button asChild>
                <Link href="/">Create Subdomain</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 