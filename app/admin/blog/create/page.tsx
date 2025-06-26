'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Save, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createBlogPostAction } from '@/app/actions';
import { getAllTenants } from '@/lib/tenants';

const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published', 'scheduled']),
  publishedAt: z.string().optional(),
  tenantId: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof createBlogPostSchema>;

export default function CreateBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createBlogPostSchema),
    defaultValues: {
      status: 'draft',
    },
  });

  const watchedTitle = watch('title');

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchedTitle, setValue]);

  // Fetch tenants
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/tenants');
        if (response.ok) {
          const data = await response.json();
          setTenants(data.tenants || []);
        }
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };

    fetchTenants();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== 'none') {
          formData.append(key, value);
        }
      });

      const result = await createBlogPostAction(formData);

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Blog post created successfully!' });
        setTimeout(() => {
          router.push('/admin/blog');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create blog post' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Blog Post</h1>
          <p className="text-gray-600 mt-1">
            Write and publish a new blog post
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/blog">
              Cancel
            </Link>
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Draft
          </Button>
          <Button 
            onClick={() => {
              setValue('status', 'published');
              handleSubmit(onSubmit)();
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Publish
          </Button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>
                Write your blog post content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter your post title..."
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="your-post-url-slug"
                  className="mt-1"
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder="A brief summary of your post..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  placeholder="Write your blog post content here..."
                  className="mt-1"
                  rows={20}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Publishing Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>
                Configure publishing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => setValue('status', value as any)} defaultValue="draft">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="publishedAt">Publish Date</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  {...register('publishedAt')}
                  className="mt-1"
                />
              </div>
              
              {tenants.length > 0 && (
                <div>
                  <Label htmlFor="tenantId">Associate with Subdomain</Label>
                  <Select onValueChange={(value) => setValue('tenantId', value === 'none' ? undefined : value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a subdomain (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No subdomain</SelectItem>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.subdomain} - {tenant.name || 'Unnamed'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>
                Search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  {...register('metaTitle')}
                  placeholder="SEO title for search engines..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  {...register('metaDescription')}
                  placeholder="SEO description for search engines..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  {...register('keywords')}
                  placeholder="keyword1, keyword2, keyword3"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Categories & Tags</CardTitle>
              <CardDescription>
                Organize your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  {...register('tags')}
                  placeholder="tag1, tag2, tag3"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
} 