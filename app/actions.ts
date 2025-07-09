'use server';

import { isValidIcon, createTenant, isSubdomainAvailable, deleteTenant, updateTenantTheme } from '@/lib/tenants';
import { getCurrentUser } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { rootDomain, protocol } from '@/lib/utils';

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
