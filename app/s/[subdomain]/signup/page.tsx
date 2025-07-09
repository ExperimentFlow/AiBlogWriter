import { notFound } from 'next/navigation';
import { getTenantWithLocalization } from '@/lib/tenants';
import { TenantSignupForm } from '@/components/tenant-signup-form';
import { Card, CardContent } from '@/components/ui/card';

export default async function TenantSignupPage({
  params,
  searchParams
}: {
  params: { subdomain: string };
  searchParams: { lang?: string };
}) {
  const { subdomain } = params;
  const lang = searchParams?.lang || undefined;
  const tenant = await getTenantWithLocalization(subdomain, lang);

  if (!tenant || !tenant.isActive) {
    notFound();
  }

  const currentLanguage = tenant.currentLanguage;
  const theme = tenant.themeConfig;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradients.hero}`}>
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{tenant.favicon}sdfdfsdf</div>
              <div>
                <div className="font-semibold" style={{ color: theme.colors.text }}>
                  {tenant.name || subdomain}
                </div>
                <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                  {subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-xl" style={{ backgroundColor: theme.colors.surface }}>
            <CardContent className="p-8">
              <TenantSignupForm 
                tenantName={tenant.name} 
                tenantSubdomain={subdomain}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 