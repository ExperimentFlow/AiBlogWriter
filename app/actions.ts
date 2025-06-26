'use server';

import { isValidIcon, createTenant, isSubdomainAvailable, deleteTenant, updateTenantTheme } from '@/lib/tenants';
import { getCurrentUser } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { rootDomain, protocol } from '@/lib/utils';
import { createBlogPost, updateBlogPost, deleteBlogPost, getAllBlogPosts } from '@/lib/blog';
import { z } from 'zod';

export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to create a subdomain' };
    }

    const subdomain = formData.get('subdomain') as string;
    const icon = formData.get('icon') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!subdomain || !icon) {
      return { success: false, error: 'Subdomain and icon are required' };
    }

    if (!isValidIcon(icon)) {
      return {
        subdomain,
        icon,
        success: false,
        error: 'Please enter a valid emoji (maximum 10 characters)'
      };
    }

    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

    if (sanitizedSubdomain !== subdomain) {
      return {
        subdomain,
        icon,
        success: false,
        error:
          'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.'
      };
    }

    // Check if subdomain is available
    const isAvailable = await isSubdomainAvailable(sanitizedSubdomain);
    if (!isAvailable) {
      return {
        subdomain,
        icon,
        success: false,
        error: 'This subdomain is already taken'
      };
    }

    // Create tenant in database
    const tenant = await createTenant({
      subdomain: sanitizedSubdomain,
      emoji: icon,
      name: name || undefined,
      description: description || undefined,
      userId: user.id,
    });

    revalidatePath('/admin');
    
    // Return success with redirect URL instead of redirecting directly
    return {
      success: true,
      subdomain: sanitizedSubdomain,
      redirectUrl: `${protocol}://${sanitizedSubdomain}.${rootDomain}`,
      message: 'Subdomain created successfully!'
    };
  } catch (error) {
    console.error('Error creating subdomain:', error);
    return {
      success: false,
      error: 'An error occurred while creating the subdomain'
    };
  }
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to delete a subdomain' };
    }

    const tenantId = formData.get('tenantId') as string;
    
    if (!tenantId) {
      return { success: false, error: 'Tenant ID is required' };
    }

    await deleteTenant(tenantId);
    revalidatePath('/admin');
    return { success: true, message: 'Subdomain deleted successfully' };
  } catch (error) {
    console.error('Error deleting subdomain:', error);
    return { success: false, error: 'An error occurred while deleting the subdomain' };
  }
}

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

export async function createBlogPostAction(formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as 'draft' | 'published' | 'scheduled',
      publishedAt: formData.get('publishedAt') as string,
      tenantId: formData.get('tenantId') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      keywords: formData.get('keywords') as string,
      category: formData.get('category') as string,
      tags: formData.get('tags') as string,
    };

    const validatedData = createBlogPostSchema.parse(rawData);

    const blogPost = await createBlogPost({
      ...validatedData,
      publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined,
    });

    return {
      success: true,
      message: 'Blog post created successfully',
      data: blogPost,
    };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create blog post',
    };
  }
}

const updateBlogPostSchema = createBlogPostSchema.extend({
  id: z.string().min(1, 'Post ID is required'),
});

export async function updateBlogPostAction(formData: FormData) {
  try {
    const rawData = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as 'draft' | 'published' | 'scheduled',
      publishedAt: formData.get('publishedAt') as string,
      tenantId: formData.get('tenantId') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      keywords: formData.get('keywords') as string,
      category: formData.get('category') as string,
      tags: formData.get('tags') as string,
    };

    const validatedData = updateBlogPostSchema.parse(rawData);

    const blogPost = await updateBlogPost({
      ...validatedData,
      publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined,
    });

    return {
      success: true,
      message: 'Blog post updated successfully',
      data: blogPost,
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update blog post',
    };
  }
}

export async function deleteBlogPostAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    
    if (!id) {
      return {
        success: false,
        error: 'Blog post ID is required',
      };
    }

    await deleteBlogPost(id);

    return {
      success: true,
      message: 'Blog post deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete blog post',
    };
  }
}

export async function getAllBlogPostsAction() {
  try {
    const posts = await getAllBlogPosts();
    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blog posts',
    };
  }
}

export async function updateThemeAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to update themes' };
    }

    const tenantId = formData.get('tenantId') as string;
    const themeId = formData.get('themeId') as string;

    if (!tenantId || !themeId) {
      return { success: false, error: 'Tenant ID and theme ID are required' };
    }

    await updateTenantTheme(tenantId, themeId);
    revalidatePath('/admin/themes');
    
    return { 
      success: true, 
      message: 'Theme updated successfully' 
    };
  } catch (error) {
    console.error('Error updating theme:', error);
    return { 
      success: false, 
      error: 'An error occurred while updating the theme' 
    };
  }
}
