import { z } from 'zod';

// Product Price validation schema
export const productPriceSchema = z.object({
  name: z.string().min(1, 'Price name is required').max(100, 'Price name must be less than 100 characters'),
  price: z.number().positive('Price must be greater than 0').max(999999.99, 'Price must be less than 1,000,000'),
  type: z.enum(['one_time', 'subscription'], {
    errorMap: () => ({ message: 'Type must be either one_time or subscription' })
  }),
  interval: z.string().nullable().optional(),
  intervalCount: z.number().int().positive().nullable().optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must be less than 200 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  prices: z.array(productPriceSchema).min(1, 'At least one price option is required'),
});

// Product update schema (for editing existing products)
export const productUpdateSchema = productSchema.extend({
  id: z.string().cuid('Invalid product ID'),
});

// Product price creation schema (for API)
export const productPriceCreateSchema = productPriceSchema.extend({
  storePriceId: z.string().optional(),
  gateway: z.string().optional(),
});

// Product creation schema (for API) - slug can be provided or auto-generated
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must be less than 200 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  prices: z.array(productPriceCreateSchema).min(1, 'At least one price option is required'),
});

// Product update schema (for API) - slug is auto-generated
export const productUpdateApiSchema = z.object({
  id: z.string().cuid('Invalid product ID'),
  name: z.string().min(1, 'Product name is required').max(200, 'Product name must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  prices: z.array(productPriceCreateSchema).min(1, 'At least one price option is required'),
});

// Validation for subscription prices
export const validateSubscriptionPrice = (price: z.infer<typeof productPriceSchema>) => {
  if (price.type === 'subscription') {
    if (!price.interval) {
      throw new Error('Interval is required for subscription prices');
    }
    if (!price.intervalCount || price.intervalCount < 1) {
      throw new Error('Interval count is required and must be at least 1 for subscription prices');
    }
    if (!['month', 'year'].includes(price.interval)) {
      throw new Error('Interval must be either "month" or "year"');
    }
  }
  return price;
};

// Enhanced product schema with subscription validation (for creation - no slug required)
export const productCreateSchemaWithValidation = productCreateSchema.refine(
  (data) => {
    // Validate that only one price is marked as default
    const defaultPrices = data.prices.filter(p => p.isDefault);
    if (defaultPrices.length > 1) {
      return false;
    }
    
    // Validate subscription prices
    for (const price of data.prices) {
      if (price.type === 'subscription') {
        if (!price.interval || !price.intervalCount) {
          return false;
        }
        if (!['month', 'year'].includes(price.interval)) {
          return false;
        }
      }
    }
    
    return true;
  },
  {
    message: 'Only one price can be default, and subscription prices must have valid interval (month/year) and interval count',
    path: ['prices'],
  }
);

// Enhanced product schema with subscription validation (for updates - with slug)
export const productSchemaWithValidation = productSchema.refine(
  (data) => {
    // Validate that only one price is marked as default
    const defaultPrices = data.prices.filter(p => p.isDefault);
    if (defaultPrices.length > 1) {
      return false;
    }
    
    // Validate subscription prices
    for (const price of data.prices) {
      if (price.type === 'subscription') {
        if (!price.interval || !price.intervalCount) {
          return false;
        }
        if (!['month', 'year'].includes(price.interval)) {
          return false;
        }
      }
    }
    
    return true;
  },
  {
    message: 'Only one price can be default, and subscription prices must have valid interval (month/year) and interval count',
    path: ['prices'],
  }
);

// Type exports for TypeScript
export type ProductInput = z.infer<typeof productCreateSchema>;
export type ProductPriceInput = z.infer<typeof productPriceSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateApiSchema>; 