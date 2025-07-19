import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Field, Theme } from '../types';
import { SelectableElement } from '../SelectableElement';

interface RadioFieldProps {
  field: Field;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error: string | null;
  theme: Theme;
  isPreview?: boolean;
}

export const RadioField: React.FC<RadioFieldProps> = ({ 
  field, 
  value, 
  onChange, 
  error, 
  theme,
  isPreview = false
}) => {
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
      <label
        className="field-label"
        style={{
          color: field.styling?.labelColor || theme.textColor,
          fontSize: field.styling?.labelFontSize || "14px",
          fontWeight: "500",
          marginBottom: theme.spacing.sm,
          display: "block",
        }}
      >
        {field.label}
        {field.required && <span style={{ color: theme.errorColor }}> *</span>}
      </label>
      <div
        className="radio-group"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.sm,
        }}
      >
        {optionsArray.map((option, index) => {
          const radioOptionElement = {
            id: `radio-option-${field.id}-${option.value}`,
            type: 'field' as const,
            label: `${field.label} - ${option.label}`,
            path: `steps[0].sections[0].fields[${field.id}]`,
            styling: {
              backgroundColor: field.styling?.optionBackgroundColor || (value === option.value 
                ? (theme.colorScheme === 'dark' ? "#1e3a8a" : "#e7f3ff") 
                : (theme.colorScheme === 'dark' ? "#2a2a2a" : theme.backgroundColor)),
              color: field.styling?.color || theme.textColor,
              padding: field.styling?.optionPadding || theme.spacing.md,
              borderRadius: field.styling?.optionBorderRadius || theme.borderRadius,
              border: field.styling?.optionBorder || `1px solid ${value === option.value ? theme.primaryColor : theme.borderColor}`,
              fontSize: field.styling?.fontSize || '14px',
              width: field.styling?.width || '100%',
              height: field.styling?.height || 'auto',
            }
          };

          return (
            <>
              <label
                className="radio-option"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: field.styling?.optionPadding || theme.spacing.md,
                  border: field.styling?.optionBorder || `1px solid ${value === option.value ? theme.primaryColor : theme.borderColor}`,
                  borderRadius: field.styling?.optionBorderRadius || theme.borderRadius,
                  backgroundColor: field.styling?.optionBackgroundColor || (value === option.value 
                    ? (theme.colorScheme === 'dark' ? "#1e3a8a" : "#e7f3ff") 
                    : (theme.colorScheme === 'dark' ? "#2a2a2a" : theme.backgroundColor)),
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  style={{
                    marginRight: theme.spacing.sm,
                    accentColor: theme.primaryColor,
                  }}
                />
                <div className="radio-content" style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: "500", 
                    color: field.styling?.color || theme.textColor,
                    fontSize: field.styling?.fontSize || '14px'
                  }}>
                    {option.label}
                    {option.price && (
                      <span style={{ float: "right", color: theme.primaryColor }}>
                        ${option.price}
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <div
                      style={{
                        fontSize: field.styling?.fontSize || "12px",
                        color: field.styling?.color || theme.secondaryColor,
                        marginTop: "4px",
                      }}
                    >
                      {option.description}
                    </div>
                  )}
                </div>
              </label>
            </>
          );
        })}
      </div>
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