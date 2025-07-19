import React from "react";
import { Field, Theme } from "../types";

interface SelectFieldProps {
  field: Field;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error: string | null;
  theme: Theme;
  isPreview?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  field,
  value,
  onChange,
  error,
  theme,
  isPreview = false,
}) => {
  // Parse options from field.options (string with newlines) or use empty array
  const optionsArray = Array.isArray(field.options)
    ? field.options
    : typeof field.options === 'string'
      ? field.options.split('\n').filter(opt => opt.trim()).map(opt => ({ label: opt.trim(), value: opt.trim() }))
      : [];

  return (
    <div className="field-wrapper">
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: theme.textColor }}
      >
        {field.label}
        {field.required && <span style={{ color: theme.errorColor }}> *</span>}
      </label>
      
      <select
        value={value || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        disabled={!isPreview}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          borderColor: error ? theme.errorColor : theme.borderColor,
          borderRadius: theme.borderRadius,
          fontSize: theme.fontSize,
        }}
      >
        <option value="">{field.placeholder || "Select an option"}</option>
        {optionsArray.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {field.description && (
        <p
          className="text-sm mt-1"
          style={{ color: theme.secondaryColor }}
        >
          {field.description}
        </p>
      )}
      
      {error && (
        <p
          className="text-sm mt-1"
          style={{ color: theme.errorColor }}
        >
          {error}
        </p>
      )}
    </div>
  );
}; 