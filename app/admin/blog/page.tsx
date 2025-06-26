'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { deleteBlogPostAction } from '@/app/actions';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: string;
  publishedAt?: string;
  author: {
    id: string;
    name?: string;
    email: string;
  };
  tenant?: {
    id: string;
    subdomain: string;
    name?: string;
  };
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setDeletingId(id);
    try {
      const formData = new FormData();
      formData.append('id', id);
      
      const result = await deleteBlogPostAction(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Blog post deleted successfully!' });
        setPosts(posts.filter(post => post.id !== id));
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete blog post' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage blog posts for your platform
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Link>
        </Button>
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

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {post.excerpt || 'No excerpt provided'}
                  </CardDescription>
                  {post.tenant && (
                    <div className="mt-2">
                      <Badge variant="outline">
                        {post.tenant.subdomain} - {post.tenant.name || 'Unnamed'}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge 
                    variant={post.status === 'published' ? 'default' : 'secondary'}
                  >
                    {post.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {post.author.name || post.author.email}</span>
                  {post.publishedAt && (
                    <span>Published {new Date(post.publishedAt).toLocaleDateString()}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views} views
                  </span>
                  <span>Created {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/blog/${post.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                  >
                    {deletingId === post.id ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-1" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first blog post.</p>
            <Button asChild>
              <Link href="/admin/blog/create">Create First Post</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 