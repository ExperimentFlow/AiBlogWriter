import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, User, Clock } from 'lucide-react';
import { getTenantWithLocalization } from '@/lib/tenants';
import { rootDomain, protocol } from '@/lib/utils';

export async function generateMetadata({
  params,
  searchParams
}: {
  params: { subdomain: string };
  searchParams: { lang?: string };
}): Promise<Metadata> {
  const { subdomain } = params;
  const lang = searchParams?.lang || undefined;
  const tenant = await getTenantWithLocalization(subdomain, lang);

  if (!tenant) {
    return {
      title: 'Site Not Found',
    };
  }

  return {
    title: tenant.name || `${subdomain} - Blog`,
    description: tenant.description || `Welcome to ${subdomain}`,
  };
}

export default async function SubdomainPage({
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

  return (
    <div className={`min-h-screen bg-gradient-to-br ${tenant.themeConfig.gradients.hero}`}>
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{tenant.favicon}</div>
              <div>
                <div className="font-semibold" style={{ color: tenant.themeConfig.colors.text }}>
                  {tenant.name || subdomain}
                </div>
                <div className="text-xs" style={{ color: tenant.themeConfig.colors.textSecondary }}>
                  {subdomain}.{rootDomain}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`/signup?lang=${lang}`}
                className="text-sm hover:opacity-80 transition-opacity flex items-center gap-1 px-3 py-1 rounded-md border"
                style={{ 
                  color: tenant.themeConfig.colors.primary,
                  borderColor: tenant.themeConfig.colors.primary 
                }}
              >
                Sign Up
              </Link>
              <Link
                href={`${protocol}://${rootDomain}`}
                className="text-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                style={{ color: tenant.themeConfig.colors.textSecondary }}
              >
                <ExternalLink className="h-4 w-4" />
                {rootDomain}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-8xl mb-8 animate-pulse">{tenant.favicon}</div>
          <h1 
            className={`text-5xl md:text-6xl font-bold tracking-tight mb-6 ${tenant.themeConfig.fonts.heading}`}
            style={{ color: tenant.themeConfig.colors.text }}
          >
            {tenant.name || `Welcome to ${subdomain}`}
          </h1>
          {tenant.description && (
            <p 
              className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{ color: tenant.themeConfig.colors.textSecondary }}
            >
              {tenant.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-6 text-sm" style={{ color: tenant.themeConfig.colors.textSecondary }}>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>By {tenant.user.name || tenant.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Created {new Date(tenant.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4" style={{ color: tenant.themeConfig.colors.text }}>
              Coming Soon
            </h2>
            <p className="text-lg mb-6" style={{ color: tenant.themeConfig.colors.textSecondary }}>
              This site is under construction. Check back soon for blog posts and more content!
            </p>
            <Link
              href={`/signup?lang=${lang}`}
              className="inline-flex items-center px-6 py-3 rounded-md text-white font-medium transition-colors"
              style={{ backgroundColor: tenant.themeConfig.colors.primary }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
