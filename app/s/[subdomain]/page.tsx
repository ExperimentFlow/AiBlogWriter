import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTenantWithTheme } from '@/lib/tenants';
import { getBlogPostsByTenant } from '@/lib/blog';
import { protocol, rootDomain } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Eye, FileText, ArrowRight, ExternalLink, Clock, TrendingUp, Star, Hash, BookOpen, CalendarDays, Users, BarChart3 } from 'lucide-react';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const tenant = await getTenantWithTheme(subdomain);

  if (!tenant) {
    return {
      title: rootDomain
    };
  }

  return {
    title: tenant.name || `${subdomain}.${rootDomain}`,
    description: tenant.description || `Subdomain page for ${subdomain}.${rootDomain}`
  };
}

export default async function SubdomainPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const tenant = await getTenantWithTheme(subdomain);

  if (!tenant || !tenant.isActive) {
    notFound();
  }

  // Fetch blog posts for this tenant
  const blogPosts = await getBlogPostsByTenant(tenant.id);

  // Get categories from posts
  const categories = Array.from(new Set(blogPosts.map((post: any) => post.category).filter(Boolean)));
  
  // Get featured posts (posts with highest views or most recent)
  const featuredPosts = blogPosts
    .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);
  
  // Get recent posts
  const recentPosts = blogPosts
    .sort((a: any, b: any) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    .slice(0, 6);

  // Get theme configuration
  const theme = tenant.themeConfig;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradients.hero}`}>
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{tenant.emoji}</div>
              <div>
                <div className="font-semibold" style={{ color: theme.colors.text }}>
                  {tenant.name || subdomain}
                </div>
                <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                  {subdomain}.{rootDomain}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`${protocol}://${rootDomain}`}
                className="text-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                style={{ color: theme.colors.textSecondary }}
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
          <div className="text-8xl mb-8 animate-pulse">{tenant.emoji}</div>
          <h1 
            className={`text-5xl md:text-6xl font-bold tracking-tight mb-6 ${theme.fonts.heading}`}
            style={{ color: theme.colors.text }}
          >
            {tenant.name || `Welcome to ${subdomain}`}
          </h1>
          {tenant.description && (
            <p 
              className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{ color: theme.colors.textSecondary }}
            >
              {tenant.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-6 text-sm" style={{ color: theme.colors.textSecondary }}>
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

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="border-0 shadow-lg" style={{ backgroundColor: theme.colors.surface }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: theme.colors.primary }}>{blogPosts.length}</div>
              <div className="flex items-center justify-center gap-2" style={{ color: theme.colors.textSecondary }}>
                <FileText className="h-4 w-4" />
                <span>Total Posts</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg" style={{ backgroundColor: theme.colors.surface }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: theme.colors.secondary }}>{categories.length}</div>
              <div className="flex items-center justify-center gap-2" style={{ color: theme.colors.textSecondary }}>
                <Hash className="h-4 w-4" />
                <span>Categories</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg" style={{ backgroundColor: theme.colors.surface }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: theme.colors.accent }}>
                {blogPosts.reduce((total: number, post: any) => total + (post.views || 0), 0)}
              </div>
              <div className="flex items-center justify-center gap-2" style={{ color: theme.colors.textSecondary }}>
                <Eye className="h-4 w-4" />
                <span>Total Views</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg" style={{ backgroundColor: theme.colors.surface }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: theme.colors.primary }}>
                {blogPosts.length > 0 ? Math.round(blogPosts.reduce((total: number, post: any) => total + (post.views || 0), 0) / blogPosts.length) : 0}
              </div>
              <div className="flex items-center justify-center gap-2" style={{ color: theme.colors.textSecondary }}>
                <BarChart3 className="h-4 w-4" />
                <span>Avg Views</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Hash className="h-6 w-6" style={{ color: theme.colors.primary }} />
              <h2 className={`text-2xl font-bold ${theme.fonts.heading}`} style={{ color: theme.colors.text }}>
                Categories
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category: string) => {
                const categoryPosts = blogPosts.filter((post: any) => post.category === category);
                return (
                  <Card key={category} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group" style={{ backgroundColor: theme.colors.surface }}>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold mb-2" style={{ color: theme.colors.primary }}>{categoryPosts.length}</div>
                      <div className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>{category}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-6 w-6" style={{ color: theme.colors.accent }} />
              <h2 className={`text-2xl font-bold ${theme.fonts.heading}`} style={{ color: theme.colors.text }}>
                Featured Posts
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post: any) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden" style={{ backgroundColor: theme.colors.surface }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category || 'General'}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs" style={{ color: theme.colors.textSecondary }}>
                        <Star className="h-3 w-3" style={{ color: theme.colors.accent }} />
                        <span>Featured</span>
                      </div>
                    </div>
                    <CardTitle 
                      className={`text-xl line-clamp-2 group-hover:opacity-80 transition-opacity ${theme.fonts.heading}`}
                      style={{ color: theme.colors.text }}
                    >
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3" style={{ color: theme.colors.textSecondary }}>
                      {post.excerpt || 'No excerpt available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author.name || post.author.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-sm" style={{ color: theme.colors.textSecondary }}>
                        <Eye className="h-4 w-4" />
                        <span>{post.views} views</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="w-full group-hover:opacity-80 transition-all"
                      style={{ 
                        borderColor: theme.colors.primary,
                        color: theme.colors.primary 
                      }}
                    >
                      <Link href={`/blog/${post.slug}`} className="flex items-center justify-center gap-2">
                        Read Article
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Posts Section */}
        {recentPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6" style={{ color: theme.colors.accent }} />
                <h2 className={`text-2xl font-bold ${theme.fonts.heading}`} style={{ color: theme.colors.text }}>
                  Recent Posts
                </h2>
              </div>
              <Badge variant="outline" className="text-sm px-4 py-2" style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
                {blogPosts.length} total posts
              </Badge>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post: any) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden" style={{ backgroundColor: theme.colors.surface }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category || 'General'}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs" style={{ color: theme.colors.textSecondary }}>
                        <Eye className="h-3 w-3" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    <CardTitle 
                      className={`text-xl line-clamp-2 group-hover:opacity-80 transition-opacity ${theme.fonts.heading}`}
                      style={{ color: theme.colors.text }}
                    >
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3" style={{ color: theme.colors.textSecondary }}>
                      {post.excerpt || 'No excerpt available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author.name || post.author.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="w-full group-hover:opacity-80 transition-all"
                      style={{ 
                        borderColor: theme.colors.primary,
                        color: theme.colors.primary 
                      }}
                    >
                      <Link href={`/blog/${post.slug}`} className="flex items-center justify-center gap-2">
                        Read Article
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Blog Posts Message */}
        {blogPosts.length === 0 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: theme.colors.surface }}>
              <FileText className="h-12 w-12" style={{ color: theme.colors.primary }} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${theme.fonts.heading}`} style={{ color: theme.colors.text }}>
              No blog posts yet
            </h3>
            <p className="mb-8 text-lg" style={{ color: theme.colors.textSecondary }}>
              This blog is just getting started. Check back soon for amazing content!
            </p>
            <div className="rounded-lg p-6" style={{ backgroundColor: theme.colors.surface }}>
              <div className="text-sm space-y-2" style={{ color: theme.colors.textSecondary }}>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                  <span>Blog posts will appear here once published</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
                  <span>Follow for updates and new content</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg" style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}>
            <CardContent className="p-8 text-center text-white">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="h-8 w-8" />
                <h3 className={`text-2xl font-bold ${theme.fonts.heading}`}>Stay Updated</h3>
              </div>
              <p className="mb-6 max-w-2xl mx-auto opacity-90">
                Get notified when new posts are published. Never miss out on the latest insights and stories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button variant="secondary" className="px-6">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20" style={{ backgroundColor: theme.colors.surface }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>Powered by <Link href={`${protocol}://${rootDomain}`} className="hover:opacity-80 transition-opacity" style={{ color: theme.colors.primary }}>{rootDomain}</Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
