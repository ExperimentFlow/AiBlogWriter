import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';
import { getAllTenants, updateTenantTheme } from '@/lib/tenants';
import { themes, getTheme } from '@/lib/themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, Eye } from 'lucide-react';
import { ThemeFormWrapper } from './theme-form-wrapper';

export default async function ThemeSettingsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/signin');
  }

  const tenants = await getAllTenants();
  const userTenants = tenants.filter((tenant: any) => tenant.userId === user.id);

  if (userTenants.length === 0) {
    redirect('/admin/subdomains');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Palette className="h-8 w-8 text-purple-600" />
          Theme Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Customize the appearance of your blog with beautiful themes
        </p>
      </div>

      <div className="grid gap-8">
        {userTenants.map((tenant: any) => (
          <Card key={tenant.id} className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{tenant.emoji}</div>
                  <div>
                    <CardTitle className="text-xl">{tenant.name || tenant.subdomain}</CardTitle>
                    <CardDescription>
                      {tenant.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={tenant.isActive ? "default" : "secondary"}>
                  {tenant.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ThemeFormWrapper tenant={tenant} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Theme Gallery */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Themes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <Card key={theme.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{theme.preview}</div>
                  <Badge variant="outline" className="text-xs">
                    {theme.id}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{theme.name}</CardTitle>
                <CardDescription>{theme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Theme Preview */}
                  <div 
                    className={`h-20 rounded-lg bg-gradient-to-br ${theme.gradients.hero} border-2 border-gray-200`}
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.colors.background}, ${theme.colors.surface})`
                    }}
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: theme.colors.text }}>
                          {theme.name}
                        </div>
                        <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                          Preview
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Color Palette */}
                  <div className="flex gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-200" 
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-200" 
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-200" 
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 