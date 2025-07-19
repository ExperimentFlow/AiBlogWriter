import { useState } from 'react';
import { productCreateSchema, productPriceSchema, ProductInput, ProductPriceInput } from '@/lib/validations/product';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const useProductValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateProduct = (data: ProductInput): ValidationResult => {
    const result = productCreateSchema.safeParse(data);
    
    if (!result.success) {
      const validationErrors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      setErrors(validationErrors);
      return {
        isValid: false,
        errors: validationErrors
      };
    }

    // Additional custom validation
    const customErrors: ValidationError[] = [];
    
    // Check if only one price is default
    const defaultPrices = data.prices.filter(p => p.isDefault);
    if (defaultPrices.length > 1) {
      customErrors.push({
        field: 'prices',
        message: 'Only one price can be marked as default'
      });
    }

    // Validate subscription prices
    for (let i = 0; i < data.prices.length; i++) {
      const price = data.prices[i];
      if (price.type === 'subscription') {
        if (!price.interval) {
          customErrors.push({
            field: `prices.${i}.interval`,
            message: 'Interval is required for subscription prices'
          });
        }
        if (!price.intervalCount || price.intervalCount < 1) {
          customErrors.push({
            field: `prices.${i}.intervalCount`,
            message: 'Interval count is required and must be at least 1'
          });
        }
        if (price.interval && !['month', 'year'].includes(price.interval)) {
          customErrors.push({
            field: `prices.${i}.interval`,
            message: 'Interval must be either "month" or "year"'
          });
        }
      }
    }

    if (customErrors.length > 0) {
      setErrors(customErrors);
      return {
        isValid: false,
        errors: customErrors
      };
    }

    setErrors([]);
    return {
      isValid: true,
      errors: []
    };
  };

  const validatePrice = (price: ProductPriceInput, index?: number): ValidationError[] => {
    const result = productPriceSchema.safeParse(price);
    
    if (!result.success) {
      return result.error.errors.map(err => ({
        field: index !== undefined ? `prices.${index}.${err.path.join('.')}` : err.path.join('.'),
        message: err.message
      }));
    }

    const errors: ValidationError[] = [];

    // Additional validation for subscription prices
    if (price.type === 'subscription') {
      if (!price.interval) {
        errors.push({
          field: index !== undefined ? `prices.${index}.interval` : 'interval',
          message: 'Interval is required for subscription prices'
        });
      }
      if (!price.intervalCount || price.intervalCount < 1) {
        errors.push({
          field: index !== undefined ? `prices.${index}.intervalCount` : 'intervalCount',
          message: 'Interval count is required and must be at least 1'
        });
      }
      if (price.interval && !['month', 'year'].includes(price.interval)) {
        errors.push({
          field: index !== undefined ? `prices.${index}.interval` : 'interval',
          message: 'Interval must be either "month" or "year"'
        });
      }
    }

    return errors;
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const clearFieldError = (field: string) => {
    setErrors(errors.filter(error => error.field !== field));
  };

  return {
    validateProduct,
    validatePrice,
    getFieldError,
    clearErrors,
    clearFieldError,
    errors
  };
}; 