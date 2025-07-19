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

  const optionsArray = Array.isArray(field.options)
    ? field.options
    : typeof field.options === 'string'
      ? field.options.split('\n').filter(opt => opt.trim()).map(opt => ({ label: opt.trim(), value: opt.trim() }))
      : [];

  return (
    <div
      className="field-container"
      style={{ gridColumn: `span ${field.columnSpan || 1}` }}
    >
      <span style={{ fontSize: field.styling?.labelFontSize || "14px", color: field.styling?.labelColor || theme.textColor }}>
        {field.label}
        {field.required && <span style={{ color: theme.errorColor }}> *</span>}
      </span>
      {optionsArray.map((option, idx) => (
        <label
          key={option.value}
          className="checkbox-label"
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            gap: theme.spacing.sm,
            color: field.styling?.labelColor || theme.textColor,
            marginTop: theme.spacing.xs,
          }}
        >
          <SelectableElement element={checkboxElement} isPreview={isPreview}>
            <input
              type="checkbox"
              checked={Array.isArray(value) ? value.includes(option.value) : false}
              onChange={(e) => {
                let newValue = Array.isArray(value) ? [...value] : [];
                if (e.target.checked) {
                  newValue.push(option.value);
                } else {
                  newValue = newValue.filter((v) => v !== option.value);
                }
                onChange(field.id, newValue);
              }}
              style={{
                accentColor: field.styling?.checkboxColor || theme.primaryColor,
                width: field.styling?.checkboxSize || "20px",
                height: field.styling?.checkboxSize || "20px",
              }}
            />
          </SelectableElement>
          <span>{option.label}</span>
        </label>
      ))}
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