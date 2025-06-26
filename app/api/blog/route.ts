import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog';
import { getCurrentUser } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const posts = await getAllBlogPosts();
    
    return NextResponse.json({
      success: true,
      posts: posts.map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        status: post.status,
        publishedAt: post.publishedAt?.toISOString(),
        author: post.author,
        tenant: post.tenant,
        views: post.views,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      }))
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
} 