import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/blog';
import { protocol, rootDomain } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye, ArrowLeft, FileText, Clock, Share2, BookOpen, Tag } from 'lucide-react';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found'
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || post.title,
    keywords: post.keywords,
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {post.tenant && (
                <div className="text-2xl">{post.tenant.emoji}</div>
              )}
              <div>
                <div className="font-semibold text-gray-900">
                  {post.tenant ? (post.tenant.name || post.tenant.subdomain) : 'Blog'}
                </div>
                <div className="text-xs text-gray-500">
                  {post.tenant ? `${post.tenant.subdomain}.${rootDomain}` : rootDomain}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={post.tenant ? `/s/${post.tenant.subdomain}` : `/${rootDomain}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              {post.category && (
                <Badge variant="secondary" className="text-sm">
                  {post.category}
                </Badge>
              )}
              {post.tenant && (
                <Badge variant="outline" className="text-sm">
                  {post.tenant.subdomain}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white rounded-lg shadow-sm border">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{post.author.name || post.author.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.publishedAt!).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>5 min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <Card className="mb-12 border-0 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">
                  {post.content}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags Section */}
          {post.tags && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.split(',').map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Author Section */}
          <div className="mb-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {post.author.name || post.author.email}
                    </h3>
                    <p className="text-gray-600">
                      Author and content creator
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Posts Section */}
          {post.tenant && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  More from {post.tenant.name || post.tenant.subdomain}
                </h2>
              </div>
              <p className="text-gray-600 mb-8 text-lg">
                Discover more amazing content from this blog
              </p>
              <Button asChild size="lg" className="px-8">
                <Link href={`/s/${post.tenant.subdomain}`}>
                  <BookOpen className="h-5 w-5 mr-2" />
                  View All Posts
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>Powered by <Link href={`${protocol}://${rootDomain}`} className="text-blue-600 hover:underline">{rootDomain}</Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
} 