import prisma from './prisma';
import { getCurrentUser } from './auth-utils';

export interface CreateBlogPostData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: Date;
  tenantId?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  category?: string;
  tags?: string;
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}

export async function createBlogPost(data: CreateBlogPostData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Check if slug is unique
  const existingPost = await prisma.blogPost.findUnique({
    where: { slug: data.slug }
  });

  if (existingPost) {
    throw new Error('A blog post with this slug already exists');
  }

  // If tenantId is provided, verify the tenant exists and user owns it
  if (data.tenantId) {
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: data.tenantId,
        userId: user.id
      }
    });

    if (!tenant) {
      throw new Error('Tenant not found or access denied');
    }
  }

  const blogPost = await prisma.blogPost.create({
    data: {
      ...data,
      authorId: user.id,
      publishedAt: data.status === 'published' ? new Date() : data.publishedAt,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      tenant: {
        select: {
          id: true,
          subdomain: true,
          name: true,
        }
      }
    }
  });

  return blogPost;
}

export async function updateBlogPost(data: UpdateBlogPostData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Check if user owns the blog post
  const existingPost = await prisma.blogPost.findFirst({
    where: {
      id: data.id,
      authorId: user.id
    }
  });

  if (!existingPost) {
    throw new Error('Blog post not found or access denied');
  }

  // If slug is being updated, check if it's unique
  if (data.slug && data.slug !== existingPost.slug) {
    const slugExists = await prisma.blogPost.findUnique({
      where: { slug: data.slug }
    });

    if (slugExists) {
      throw new Error('A blog post with this slug already exists');
    }
  }

  const updatedPost = await prisma.blogPost.update({
    where: { id: data.id },
    data: {
      ...data,
      publishedAt: data.status === 'published' && !existingPost.publishedAt 
        ? new Date() 
        : data.publishedAt,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      tenant: {
        select: {
          id: true,
          subdomain: true,
          name: true,
        }
      }
    }
  });

  return updatedPost;
}

export async function deleteBlogPost(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      id,
      authorId: user.id
    }
  });

  if (!post) {
    throw new Error('Blog post not found or access denied');
  }

  await prisma.blogPost.delete({
    where: { id }
  });

  return { success: true };
}

export async function getAllBlogPosts() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const posts = await prisma.blogPost.findMany({
    where: {
      authorId: user.id
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      tenant: {
        select: {
          id: true,
          subdomain: true,
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return posts;
}

export async function getBlogPostById(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      id,
      authorId: user.id
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      tenant: {
        select: {
          id: true,
          subdomain: true,
          name: true,
        }
      }
    }
  });

  return post;
}

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      tenant: {
        select: {
          id: true,
          subdomain: true,
          name: true,
        }
      }
    }
  });

  if (!post || post.status !== 'published') {
    return null;
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: {
      views: {
        increment: 1
      }
    }
  });

  return post;
}

export async function getBlogPostsByTenant(tenantId: string) {
  const posts = await prisma.blogPost.findMany({
    where: {
      tenantId,
      status: 'published'
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      tenant: {
        select: {
          id: true,
          subdomain: true,
          name: true,
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    }
  });

  return posts;
}

export async function getPublishedBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: 'published'
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      tenant: {
        select: {
          id: true,
          subdomain: true,
          name: true,
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    }
  });

  return posts;
} 