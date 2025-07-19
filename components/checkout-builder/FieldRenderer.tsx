import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Field, Theme } from "./types";
import { TextField } from "./fields/TextField";
import { CheckboxField } from "./fields/CheckboxField";
import { RadioField } from "./fields/RadioField";
import { SelectField } from "./fields/SelectField";
import { TextAreaField } from "./fields/TextAreaField";
import { DateField } from "./fields/DateField";
import { SelectableElement } from "./SelectableElement";
import { GripVertical, Trash2 } from "lucide-react";
import { useCheckoutBuilder } from "./contexts/CheckoutBuilderContext";

interface FieldRendererProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error: string | null;
  stepIndex?: number;
  sectionIndex?: number;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  stepIndex = 0,
  sectionIndex = 0,
}) => {
  const {
    // State from context
    formData,
    isPreview,
    
    // Computed values from context
    theme,
    
    // Handlers from context
    handleDeleteField,
    handleMoveField,
  } = useCheckoutBuilder();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `field-${field.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Check conditional logic
  if (field.conditional) {
    const { field: condField, operator, value: condValue } = field.conditional;
    const condFieldValue = formData[condField];

    if (operator === "equals" && condFieldValue !== condValue) {
      return null;
    }
  }

  const fieldElement = {
    id: `field-${field.id}`,
    type: "field" as const,
    label: field.label,
    placeholder: field.placeholder || "",
    description: "",
    path: `steps[${stepIndex}].sections[${sectionIndex}].fields[${field.id}]`,
    styling: {
      backgroundColor: field.styling?.backgroundColor || theme.backgroundColor,
      color: field.styling?.color || theme.textColor,
      padding: field.styling?.padding || theme.spacing.md,
      margin: `0 0 ${theme.spacing.md} 0`,
      borderRadius: field.styling?.borderRadius || theme.borderRadius,
      border: field.styling?.border || `1px solid ${theme.borderColor}`,
      fontSize: field.styling?.fontSize || "16px",
      fontWeight: "400",
    },
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (handleDeleteField) {
      handleDeleteField(field.id);
    }
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (handleMoveField) {
      handleMoveField(field.id, 'up');
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (handleMoveField) {
      handleMoveField(field.id, 'down');
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
      case "password":
      case "url":
        return (
          <TextField
            field={field}
            value={value}
            onChange={(fieldId, value) => onChange(value)}
            error={error}
            theme={theme}
            isPreview={isPreview}
          />
        );
      case "textarea":
        return (
          <TextAreaField
            field={field}
            value={value}
            onChange={(fieldId, value) => onChange(value)}
            error={error}
            theme={theme}
            isPreview={isPreview}
          />
        );
      case "select":
        return (
          <SelectField
            field={field}
            value={value}
            onChange={(fieldId, value) => onChange(value)}
            error={error}
            theme={theme}
            isPreview={isPreview}
          />
        );
      case "checkbox":
        return (
          <CheckboxField
            field={field}
            value={value}
            onChange={(fieldId, value) => onChange(value)}
            error={error}
            theme={theme}
            isPreview={isPreview}
          />
        );
      case "radio":
        return (
          <RadioField
            field={field}
            value={value}
            onChange={(fieldId, value) => onChange(value)}
            error={error}
            theme={theme}
            isPreview={isPreview}
          />
        );
      case "date":
        return (
          <DateField
            field={field}
            value={value}
            onChange={(fieldId, value) => onChange(value)}
            error={error}
            theme={theme}
            isPreview={isPreview}
          />
        );
      default:
        return (
          <TextField
            field={field}
            value={value}
            onChange={(fieldId, value) => onChange(value)}
            error={error}
            theme={theme}
            isPreview={isPreview}
          />
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <SelectableElement element={fieldElement} isPreview={isPreview}>
        <div className="field-container relative group">
          {renderField()}
          
          {isPreview && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Move Up Button */}
            
                <button
                  type="button"
                  onClick={handleMoveUp}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors"
                  title="Move field up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              
              {/* Move Down Button */}
              
                <button
                  type="button"
                  onClick={handleMoveDown}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors"
                  title="Move field down"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
           
              
              {/* Drag Handle */}
           
                <button
                  type="button"
                  {...attributes}
                  {...listeners}
                  className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md transition-colors cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
              
              
              {/* Delete Button */}
         
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                  title="Delete field"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
             
            </div>
          )}
        </div>
      </SelectableElement>
    </div>
  );
};
