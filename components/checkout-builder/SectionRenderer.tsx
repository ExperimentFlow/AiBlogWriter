import React from "react";
import { FieldRenderer } from "./FieldRenderer";
import { AddonRenderer } from "./AddonRenderer";
import { Section, Theme, Addon, Field, CheckoutConfiguration } from "./types";
import { SelectableElement } from "./SelectableElement";
import { PlusIcon } from "lucide-react";
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCheckoutBuilder } from "./contexts/CheckoutBuilderContext";

interface SectionRendererProps {
  section: Section;
  stepIndex?: number;
  sectionIndex?: number;
}

// Helper function to get nested object value based on path
const getNestedValue = (obj: any, path: string): any => {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (key.includes("[") && key.includes("]")) {
      const arrayKey = key.split("[")[0];
      const index = parseInt(key.split("[")[1].split("]")[0]);
      if (!current[arrayKey] || !current[arrayKey][index]) return undefined;
      current = current[arrayKey][index];
    } else {
      if (!current[key]) return undefined;
      current = current[key];
    }
  }

  return current;
};

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  stepIndex = 0,
  sectionIndex = 0,
}) => {
  const {
    // State from context
    formData,
    errors,
    config,
    selectedAddons,
    isPreview,
    
    // Computed values from context
    theme,
    
    // Handlers from context
    handleFieldChange,
    handleDeleteField,
    handleMoveField,
    handleReorderFields,
    handleAddField,
    handleAddonToggle,
    handleAddonQuantityChange,
  } = useCheckoutBuilder();

  // Create dynamic path based on step and section indices
  const dynamicPath = `steps[${stepIndex}].sections[${sectionIndex}]`;
  
  // Get the step ID from the config
  const stepId = config.steps[stepIndex]?.id || '';
  
  // Get custom styling from config
  const customStyling = getNestedValue(config, `${dynamicPath}.styling`) || {};
  
  // Merge custom styling with theme defaults
  const sectionStyling = {
    backgroundColor: customStyling.backgroundColor,
    color: customStyling.color,
    padding: customStyling.padding,
    margin: customStyling.margin,
    borderRadius: customStyling.borderRadius,
    border: customStyling.border || `1px solid ${theme.borderColor}`,
    fontSize: customStyling.fontSize || "18px",
    fontWeight: customStyling.fontWeight || "600",
    gap: customStyling.gap || theme.spacing.md,
  };
  
  const sectionElement = {
    id: `section-${section.id}`,
    type: "section" as const,
    label: section.title,
    description: "",
    path: dynamicPath,
    styling: sectionStyling, // Use the merged styling
  };

  const handleDragEnd = (event: DragEndEvent) => {

    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      console.log('No over element or same element, returning');
      return;
    }

    // Extract field IDs from the sortable IDs
    const activeId = active.id as string;
    const overId = over.id as string;
    

    
    // Remove the "field-" prefix to get the actual field IDs
    const activeFieldId = activeId.replace('field-', '');
    const overFieldId = overId.replace('field-', '');
    

    
    // Find the indices of the fields
    const activeIndex = section.fields?.findIndex(field => field.id === activeFieldId) || -1;
    const overIndex = section.fields?.findIndex(field => field.id === overFieldId) || -1;
    
    console.log('Active index:', activeIndex, 'Over index:', overIndex);
    
    if (activeIndex !== -1 && overIndex !== -1 && handleReorderFields) {
      console.log('Calling handleReorderFields:', { activeIndex, overIndex, activeFieldId, overFieldId });
      handleReorderFields(section.id, activeIndex, overIndex);
    } else {
      console.log('Cannot reorder:', { activeIndex, overIndex, hasHandleReorderFields: !!handleReorderFields });
    }
  };

  return (
    <SelectableElement element={sectionElement} isPreview={isPreview}>
      <div
        className="section"
        style={{
          marginBottom: sectionStyling.margin,
          padding: sectionStyling.padding,
          border: sectionStyling.border,
          borderRadius: sectionStyling.borderRadius,
          backgroundColor: sectionStyling.backgroundColor,
          gap: sectionStyling.gap,
        }}
      >
        <div className="flex items-center justify-between">
          <h3
            style={{
              color: sectionStyling.color,
              fontSize: sectionStyling.fontSize,
              fontWeight: sectionStyling.fontWeight,
              marginBottom: theme.spacing.md,
            }}
          >
            {sectionElement.label}
          </h3>
          {isPreview && (
            <button 
              type="button" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              onClick={() => handleAddField?.(stepId, section.id, 'text')}
              title="Add new text field"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {sectionElement.description && (
          <p
            style={{
              color: theme.secondaryColor,
              fontSize: "14px",
              marginBottom: theme.spacing.md,
            }}
          >
            {sectionElement.description}
          </p>
        )}

        {/* Render fields if section has fields */}
        {section.fields && section.fields.length > 0 && (
          <div className="fields-container" style={{ gap: sectionStyling.gap }}>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={section.fields.map(field => `field-${field.id}`)}
                strategy={verticalListSortingStrategy}
              >
                {section.fields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={formData[field.id] || ""}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={errors[field.id] || null}
                    stepIndex={stepIndex}
                    sectionIndex={sectionIndex}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Render addons if section has addons */}
        {section.addons && section.addons.length > 0 && (
          <div className="addons-container" style={{ gap: sectionStyling.gap }}>
            <AddonRenderer
              addons={section.addons}
              displayType={section.displayType || "cards"}
              maxSelections={section.maxSelections}
              theme={theme}
              selectedAddons={selectedAddons}
              onAddonToggle={handleAddonToggle}
              onAddonQuantityChange={handleAddonQuantityChange}
              isPreview={isPreview}
            />
          </div>
        )}
      </div>
    </SelectableElement>
  );
};
