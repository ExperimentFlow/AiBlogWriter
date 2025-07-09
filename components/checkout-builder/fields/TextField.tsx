import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Field, Theme } from '../types';
import { SelectableElement } from '../SelectableElement';

interface TextFieldProps {
  field: Field;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error: string | null;
  theme: Theme;
  isPreview?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({ 
  field, 
  value, 
  onChange, 
  error, 
  theme,
  isPreview = false
}) => {
  const inputElement = {
    id: `input-${field.id}`,
    type: 'field' as const,
    label: field.label,
    placeholder: field.placeholder || '',
    description: '',
    path: `steps[0].sections[0].fields[${field.id}]`,
    styling: {
      backgroundColor: field.styling?.backgroundColor || (theme.colorScheme === 'dark' ? "#2a2a2a" : theme.backgroundColor),
      color: field.styling?.color || theme.textColor,
      padding: field.styling?.padding || '12px',
      borderRadius: field.styling?.borderRadius || theme.borderRadius,
      border: field.styling?.border || `1px solid ${error ? theme.errorColor : theme.borderColor}`,
      fontSize: field.styling?.fontSize || theme.fontSize,
      width: field.styling?.width || '100%',
      height: field.styling?.height || '48px',
    }
  };

  return (
    <div
      className="field-container"
      style={{ gridColumn: `span ${field.columnSpan || 1}` }}
    >
      <label
        htmlFor={field.id}
        className="field-label"
        style={{
          color: field.styling?.labelColor || theme.textColor,
          fontSize: field.styling?.labelFontSize || "14px",
          fontWeight: "500",
          marginBottom: theme.spacing.sm,
          display: "block",
        }}
      >
        {inputElement.label}
        {field.required && <span style={{ color: theme.errorColor }}> *</span>}
      </label>
      
      <SelectableElement element={inputElement} isPreview={isPreview}>
        <input
          id={field.id}
          type={field.type}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={inputElement.placeholder}
          className="field-input"
          style={{
            width: field.styling?.width || "100%",
            height: field.styling?.height || "48px",
            padding: field.styling?.padding || "12px",
            borderRadius: field.styling?.borderRadius || theme.borderRadius,
            border: field.styling?.border || `1px solid ${error ? theme.errorColor : theme.borderColor}`,
            fontSize: field.styling?.fontSize || theme.fontSize,
            backgroundColor: field.styling?.backgroundColor || (theme.colorScheme === 'dark' ? "#2a2a2a" : theme.backgroundColor),
            color: field.styling?.color || theme.textColor,
            outline: "none",
            transition: "border-color 0.3s ease",
          }}
          onFocus={(e) => {
            // Only change border color on focus if no custom border is set
            if (!field.styling?.border) {
              e.target.style.borderColor = theme.primaryColor;
            }
          }}
          onBlur={(e) => {
            // Only change border color on blur if no custom border is set
            if (!field.styling?.border) {
              e.target.style.borderColor = error ? theme.errorColor : theme.borderColor;
            }
          }}
        />
      </SelectableElement>
      
      {error && (
        <div
          className="field-error"
          style={{
            color: theme.errorColor,
            fontSize: "12px",
            marginTop: theme.spacing.xs,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.xs,
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}; 