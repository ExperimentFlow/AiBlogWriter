export type FormFieldType = 
  | 'text' 
  | 'textarea' 
  | 'email' 
  | 'number' 
  | 'tel'
  | 'url'
  | 'password'
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date' 
  | 'time'
  | 'datetime-local'
  | 'file' 
  | 'color'
  | 'range'
  | 'search'
  | 'month'
  | 'week';

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation: FormFieldValidation;
  helpText?: string;
  defaultValue?: string | number | boolean;
}

export interface FormConfig {
  title: string;
  description: string;
  submitButtonText: string;
  successMessage: string;
  theme?: 'light' | 'dark';
  layout?: 'vertical' | 'horizontal';
}

export interface FormData {
  config: FormConfig;
  fields: FormField[];
} 