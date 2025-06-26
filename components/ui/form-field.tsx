import { forwardRef } from 'react';
import { Label } from './label';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  className?: string;
}

export const FormField = forwardRef<
  HTMLInputElement,
  FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{label}</Label>
      <Input
        ref={ref}
        className={cn(
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField'; 