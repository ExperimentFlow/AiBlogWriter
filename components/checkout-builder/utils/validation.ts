import { Field } from '../types';

// Field validation function
export const validateField = (field: Field, value: any): string | null => {
  const { validation, required } = field;

  if (required && (!value || (typeof value === 'string' && value.trim() === ""))) {
    return validation?.errorMessage || "This field is required";
  }

  if (value && validation) {
    if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
      return validation.errorMessage || "Invalid format";
    }

    if (validation.minLength && value.length < validation.minLength) {
      return validation.errorMessage || `Minimum ${validation.minLength} characters required`;
    }

    if (validation.maxLength && value.length > validation.maxLength) {
      return validation.errorMessage || `Maximum ${validation.maxLength} characters allowed`;
    }
  }

  return null;
};

// Validate entire step
export const validateStep = (
  step: any, 
  formData: Record<string, any>
): Record<string, string | null> => {
  const stepErrors: Record<string, string | null> = {};

  step.sections.forEach((section: any) => {
    section.fields.forEach((field: Field) => {
      // Check conditional logic
      if (field.conditional) {
        const { field: condField, operator, value: condValue } = field.conditional;
        const condFieldValue = formData[condField];

        if (operator === "equals" && condFieldValue !== condValue) {
          return; // Skip validation for hidden fields
        }
      }

      const error = validateField(field, formData[field.id]);
      if (error) {
        stepErrors[field.id] = error;
      }
    });
  });

  return stepErrors;
}; 