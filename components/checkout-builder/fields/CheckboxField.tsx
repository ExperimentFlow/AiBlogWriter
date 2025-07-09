import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Field, Theme } from '../types';
import { SelectableElement } from '../SelectableElement';

interface CheckboxFieldProps {
  field: Field;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error: string | null;
  theme: Theme;
  isPreview?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ 
  field, 
  value, 
  onChange, 
  error, 
  theme,
  isPreview = false
}) => {
  const checkboxElement = {
    id: `checkbox-${field.id}`,
    type: 'field' as const,
    label: `${field.label} Checkbox`,
    path: `steps[0].sections[0].fields[${field.id}]`,
    styling: {
      backgroundColor: field.styling?.backgroundColor || 'transparent',
      color: field.styling?.color || theme.textColor,
      padding: field.styling?.padding || '0',
      borderRadius: field.styling?.borderRadius || '0',
      border: field.styling?.border || 'none',
      fontSize: field.styling?.fontSize || '14px',
      width: field.styling?.checkboxSize || '20px',
      height: field.styling?.checkboxSize || '20px',
    }
  };

  return (
    <div
      className="field-container"
      style={{ gridColumn: `span ${field.columnSpan || 1}` }}
    >
      <label
        className="checkbox-label"
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: theme.spacing.sm,
          color: field.styling?.labelColor || theme.textColor,
        }}
      >
        <SelectableElement element={checkboxElement} isPreview={isPreview}>
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(field.id, e.target.checked)}
            style={{
              accentColor: field.styling?.checkboxColor || theme.primaryColor,
              width: field.styling?.checkboxSize || "20px",
              height: field.styling?.checkboxSize || "20px",
            }}
          />
        </SelectableElement>
        <span style={{ 
          fontSize: field.styling?.labelFontSize || "14px",
          color: field.styling?.labelColor || theme.textColor
        }}>
          {field.label}
          {field.required && <span style={{ color: theme.errorColor }}> *</span>}
        </span>
      </label>
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