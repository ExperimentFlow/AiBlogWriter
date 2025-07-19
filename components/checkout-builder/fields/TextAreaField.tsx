import React from "react";
import { Field, Theme } from "../types";

interface TextAreaFieldProps {
  field: Field;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error: string | null;
  theme: Theme;
  isPreview?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  field,
  value,
  onChange,
  error,
  theme,
  isPreview = false,
}) => {
  return (
    <div className="field-wrapper">
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: theme.textColor }}
      >
        {field.label}
        {field.required && <span style={{ color: theme.errorColor }}> *</span>}
      </label>
      
      <textarea
        value={value || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        disabled={!isPreview}
        rows={4}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          borderColor: error ? theme.errorColor : theme.borderColor,
          borderRadius: theme.borderRadius,
          fontSize: theme.fontSize,
        }}
      />
      
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