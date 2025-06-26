'use client';

import { useState } from 'react';
import { FormField, FormConfig } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface FormPreviewProps {
  fields: FormField[];
  config: FormConfig;
}

export function FormPreview({ fields, config }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} is required`;
    }

    if (value && field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`;
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return `${field.label} must be no more than ${field.validation.maxLength} characters`;
      }
      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
        return `${field.label} format is invalid`;
      }
      if (field.validation.min && Number(value) < field.validation.min) {
        return `${field.label} must be at least ${field.validation.min}`;
      }
      if (field.validation.max && Number(value) > field.validation.max) {
        return `${field.label} must be no more than ${field.validation.max}`;
      }
    }

    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitted(true);
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const error = errors[field.id];

    const baseInputProps = {
      placeholder: field.placeholder,
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field.id, e.target.value),
      className: error ? 'border-red-500' : ''
    };

    const renderInput = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'tel':
        case 'url':
        case 'search':
          return <Input type={field.type} {...baseInputProps} />;
        
        case 'number':
        case 'range':
          return (
            <Input 
              type={field.type} 
              {...baseInputProps}
              min={field.validation.min}
              max={field.validation.max}
              step={field.validation.step}
            />
          );
        
        case 'textarea':
          return (
            <Textarea
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
          );
        
        case 'select':
          return (
            <Select
              value={value || ''}
              onValueChange={(val) => handleInputChange(field.id, val)}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        
        case 'radio':
          return (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}-${index}`}
                    name={field.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className={error ? 'border-red-500' : ''}
                  />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          );
        
        case 'checkbox':
          return (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${field.id}-${index}`}
                    value={option}
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      handleInputChange(field.id, newValues);
                    }}
                    className={error ? 'border-red-500' : ''}
                  />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          );
        
        case 'date':
        case 'time':
        case 'datetime-local':
        case 'month':
        case 'week':
          return <Input type={field.type} {...baseInputProps} />;
        
        case 'file':
          return (
            <Input
              type="file"
              onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
              className={error ? 'border-red-500' : ''}
            />
          );
        
        case 'color':
          return (
            <Input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
          );
        
        default:
          return <Input {...baseInputProps} />;
      }
    };

    return (
      <div key={field.id} className="space-y-2">
        <Label className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {renderInput()}
        
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {field.helpText && (
          <p className="text-sm text-gray-500">{field.helpText}</p>
        )}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">{config.successMessage}</p>
          <Button onClick={() => {
            setIsSubmitted(false);
            setFormData({});
            setErrors({});
          }}>
            Reset Form
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          {config.description && (
            <p className="text-gray-600">{config.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No fields to display. Add some fields in the builder first.</p>
              </div>
            ) : (
              fields.map(renderField)
            )}
            
            {fields.length > 0 && (
              <Button type="submit" className="w-full">
                {config.submitButtonText}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 