import React from "react";
import { SelectableElement } from "./contexts/ElementSelectionContext";
import { CheckoutConfiguration } from "./types";
// import { SectionStylingPanel } from "./SectionStylingPanel";
import {
  FileText,
  Package,
  Type,
  Circle,
  BarChart3,
  Layout,
  ShoppingCart,
  Palette
} from 'lucide-react';

interface ElementStylingPanelProps {
  selectedElement: SelectableElement | null;
  config: CheckoutConfiguration;
  onConfigChange: (config: CheckoutConfiguration) => void;
}

// Utility function to find field by ID in the configuration
const findFieldById = (config: any, fieldId: string): any => {
  for (const step of config.steps || []) {
    for (const section of step.sections || []) {
      for (const field of section.fields || []) {
        if (field.id === fieldId) {
          return field;
        }
      }
    }
  }
  return null;
};

// Utility function to update field by ID in the configuration
const updateFieldById = (config: any, fieldId: string, updates: any): any => {
  const newConfig = { ...config };

  for (
    let stepIndex = 0;
    stepIndex < (newConfig.steps || []).length;
    stepIndex++
  ) {
    const step = newConfig.steps[stepIndex];
    for (
      let sectionIndex = 0;
      sectionIndex < (step.sections || []).length;
      sectionIndex++
    ) {
      const section = step.sections[sectionIndex];
      for (
        let fieldIndex = 0;
        fieldIndex < (section.fields || []).length;
        fieldIndex++
      ) {
        const field = section.fields[fieldIndex];
        if (field.id === fieldId) {
          newConfig.steps[stepIndex].sections[sectionIndex].fields[fieldIndex] =
            {
              ...field,
              ...updates,
            };
          return newConfig;
        }
      }
    }
  }

  return newConfig;
};

// Utility function to update nested object properties based on path
const updateNestedObject = (obj: any, path: string, value: any): any => {
  const keys = path.split(".");
  const newObj = { ...obj };
  let current = newObj;

  // Navigate to the parent of the target property
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (key.includes("[") && key.includes("]")) {
      // Handle array access like "steps[0]"
      const arrayKey = key.split("[")[0];
      const index = parseInt(key.split("[")[1].split("]")[0]);
      if (!current[arrayKey]) current[arrayKey] = [];
      if (!current[arrayKey][index]) current[arrayKey][index] = {};
      current = current[arrayKey][index];
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  }

  // Set the target property
  const lastKey = keys[keys.length - 1];
  if (lastKey.includes("[") && lastKey.includes("]")) {
    const arrayKey = lastKey.split("[")[0];
    const index = parseInt(lastKey.split("[")[1].split("]")[0]);
    if (!current[arrayKey]) current[arrayKey] = [];
    current[arrayKey][index] = value;
  } else {
    current[lastKey] = value;
  }

  return newObj;
};

// Utility function to get nested object value based on path
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

export const ElementStylingPanel: React.FC<ElementStylingPanelProps> = ({
  selectedElement,
  config,
  onConfigChange,
}) => {
  if (!selectedElement) {
    return (
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Element Styling</h3>
        <p className="text-gray-500 text-sm">
          Click on any element in the preview to customize its styling and text
          content.
        </p>
      </div>
    );
  }

  const updateElementStyling = (
    updates: Partial<SelectableElement["styling"]>
  ) => {
    // Check if this is a field by looking for 'fields[' in the path
    const isField = selectedElement.path.includes('fields[');
    
    if (isField) {
      // Extract field ID from the element path
      const fieldId = selectedElement.path.split("fields[")[1]?.split("]")[0];
      
      console.log("updateElementStyling for field:", {
        path: selectedElement.path,
        fieldId,
        updates,
      });

      // For fields, use the field ID-based update
      const field = findFieldById(config, fieldId);
      console.log("Found field:", field);
      if (field) {
        const currentStyling = field.styling || {};
        const newStyling = { ...currentStyling, ...updates };
        console.log("Updating styling:", { currentStyling, newStyling });
        const updatedConfig = updateFieldById(config, fieldId, {
          styling: newStyling,
        });
        onConfigChange(updatedConfig);
      }
    } else {
      // For sections and other elements, use the path-based update
      console.log("updateElementStyling for section/element:", {
        path: selectedElement.path,
        updates,
      });
      
      const currentStyling =
        getNestedValue(config, selectedElement.path)?.styling || {};
      const newStyling = { ...currentStyling, ...updates };
      const updatedConfig = updateNestedObject(
        config,
        `${selectedElement.path}.styling`,
        newStyling
      );
      onConfigChange(updatedConfig);
    }
  };

  const updateElementText = (textType: string, value: string) => {
    // Check if this is a field by looking for 'fields[' in the path
    const isField = selectedElement.path.includes('fields[');
    
    if (isField) {
      // Extract field ID from the element path
      const fieldId = selectedElement.path.split("fields[")[1]?.split("]")[0];
      
      console.log("updateElementText for field:", {
        path: selectedElement.path,
        fieldId,
        textType,
        value,
      });

      // For fields, use the field ID-based update
      const updatedConfig = updateFieldById(config, fieldId, {
        [textType]: value,
      });
      console.log("Updated config for field:", updatedConfig);
      onConfigChange(updatedConfig);
    } else {
      // For sections and other elements, use the path-based update
      // Handle special case for sections: use 'title' instead of 'label'
      const actualProperty = selectedElement.type === 'section' && textType === 'label' ? 'title' : textType;
      
      console.log("updateElementText for section/element:", {
        path: selectedElement.path,
        textType: actualProperty,
        value,
      });
      
      const updatedConfig = updateNestedObject(
        config,
        `${selectedElement.path}.${actualProperty}`,
        value
      );
      onConfigChange(updatedConfig);
    }
  };

  // Get current values from the config
  const getCurrentValue = (property: string) => {
    // Check if this is a field by looking for 'fields[' in the path
    const isField = selectedElement.path.includes('fields[');
    
    if (isField) {
      // Extract field ID from the element path
      const fieldId = selectedElement.path.split("fields[")[1]?.split("]")[0];

      // For fields, use the field ID-based lookup
      const field = findFieldById(config, fieldId);
      const value = field?.[property] || "";
      console.log("getCurrentValue for field:", { fieldId, property, value, field });
      return value;
    } else {
      // For sections and other elements, use the path-based lookup
      // Handle special case for sections: use 'title' instead of 'label'
      const actualProperty = selectedElement.type === 'section' && property === 'label' ? 'title' : property;
      const value = getNestedValue(config, `${selectedElement.path}.${actualProperty}`) || "";
      console.log("getCurrentValue for section/element:", { path: selectedElement.path, property: actualProperty, value });
      return value;
    }
  };

  const getCurrentStyling = (property: string) => {
    // Check if this is a field by looking for 'fields[' in the path
    const isField = selectedElement.path.includes('fields[');
    
    if (isField) {
      // Extract field ID from the element path
      const fieldId = selectedElement.path.split("fields[")[1]?.split("]")[0];

      // For fields, use the field ID-based lookup
      const field = findFieldById(config, fieldId);
      const value = field?.styling?.[property] || "";
      console.log("getCurrentStyling for field:", { fieldId, property, value, field });
      return value;
    } else {
      // For sections and other elements, use the path-based lookup
      // Sections don't have styling in the config by default, so we need to add it
      const styling = getNestedValue(config, `${selectedElement.path}.styling`);
      const value = styling?.[property] || "";
      console.log("getCurrentStyling for section/element:", { path: selectedElement.path, property, value });
      return value;
    }
  };

  const getElementIcon = (type: SelectableElement["type"]) => {
    switch (type) {
      case "header":
        return <FileText className="w-6 h-6 text-blue-500" />;
      case "section":
        return <Package className="w-6 h-6 text-blue-500" />;
      case "field":
        return <Type className="w-6 h-6 text-blue-500" />;
      case "button":
        return <Circle className="w-6 h-6 text-blue-500" />;
      case "progress-bar":
        return <BarChart3 className="w-6 h-6 text-blue-500" />;
      case "layout":
        return <Layout className="w-6 h-6 text-blue-500" />;
      case "product-summary":
        return <ShoppingCart className="w-6 h-6 text-blue-500" />;
      default:
        return <Palette className="w-6 h-6 text-blue-500" />;
    }
  };

  const getTextFields = () => {
    const textFields = [];

    // Common text fields for most elements
    textFields.push(
      <div key="label" className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Label/Title
        </label>
        <input
          type="text"
          value={getCurrentValue("label") || selectedElement.label || ""}
          onChange={(e) => updateElementText("label", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter label or title"
        />
      </div>
    );

    // Field-specific text options
    if (selectedElement.type === "field") {
      textFields.push(
        <div key="placeholder" className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placeholder Text
          </label>
          <input
            type="text"
            value={
              getCurrentValue("placeholder") ||
              selectedElement.placeholder ||
              ""
            }
            onChange={(e) => updateElementText("placeholder", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter placeholder text"
          />
        </div>
      );

      textFields.push(
        <div key="description" className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description/Help Text
          </label>
          <textarea
            value={
              getCurrentValue("description") ||
              selectedElement.description ||
              ""
            }
            onChange={(e) => updateElementText("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description or help text"
            rows={2}
          />
        </div>
      );
    }

    // Button-specific text options
    if (selectedElement.type === "button") {
      textFields.push(
        <div key="buttonText" className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text
          </label>
          <input
            type="text"
            value={
              getCurrentValue("buttonText") || selectedElement.buttonText || ""
            }
            onChange={(e) => updateElementText("buttonText", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter button text"
          />
        </div>
      );
    }

    // Header-specific text options
    if (selectedElement.type === "header") {
      textFields.push(
        <div key="subtitle" className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle/Description
          </label>
          <textarea
            value={
              getCurrentValue("subtitle") || selectedElement.subtitle || ""
            }
            onChange={(e) => updateElementText("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter subtitle or description"
            rows={2}
          />
        </div>
      );
    }

    return textFields;
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        {getElementIcon(selectedElement.type)}
        <div>
          <h3 className="text-lg font-semibold">{selectedElement.label}</h3>
          <p className="text-sm text-gray-500 capitalize">
            {selectedElement.type.replace("-", " ")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Text Content Section */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Text Content
          </h4>
          {getTextFields()}
        </div>

        {/* Styling Section */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">Styling</h4>

          {/* Background Color */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={
                  getCurrentStyling("backgroundColor") ||
                  selectedElement.styling?.backgroundColor ||
                  "#ffffff"
                }
                onChange={(e) =>
                  updateElementStyling({ backgroundColor: e.target.value })
                }
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={
                  getCurrentStyling("backgroundColor") ||
                  selectedElement.styling?.backgroundColor ||
                  "#ffffff"
                }
                onChange={(e) =>
                  updateElementStyling({ backgroundColor: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={
                  getCurrentStyling("color") ||
                  selectedElement.styling?.color ||
                  "#333333"
                }
                onChange={(e) =>
                  updateElementStyling({ color: e.target.value })
                }
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={
                  getCurrentStyling("color") ||
                  selectedElement.styling?.color ||
                  "#333333"
                }
                onChange={(e) =>
                  updateElementStyling({ color: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#333333"
              />
            </div>
          </div>

          {/* Padding */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padding
            </label>
            <input
              type="text"
              value={
                getCurrentStyling("padding") ||
                selectedElement.styling?.padding ||
                "16px"
              }
              onChange={(e) =>
                updateElementStyling({ padding: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="16px"
            />
          </div>

          {/* Margin */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margin
            </label>
            <input
              type="text"
              value={
                getCurrentStyling("margin") ||
                selectedElement.styling?.margin ||
                "0px"
              }
              onChange={(e) => updateElementStyling({ margin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0px"
            />
          </div>

          {/* Border Radius */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border Radius
            </label>
            <input
              type="text"
              value={
                getCurrentStyling("borderRadius") ||
                selectedElement.styling?.borderRadius ||
                "8px"
              }
              onChange={(e) =>
                updateElementStyling({ borderRadius: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8px"
            />
          </div>

          {/* Border */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border
            </label>
            <input
              type="text"
              value={
                getCurrentStyling("border") ||
                selectedElement.styling?.border ||
                "1px solid #e5e7eb"
              }
              onChange={(e) => updateElementStyling({ border: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1px solid #e5e7eb"
            />
          </div>

          {/* Font Size */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <input
              type="text"
              value={
                getCurrentStyling("fontSize") ||
                selectedElement.styling?.fontSize ||
                "16px"
              }
              onChange={(e) =>
                updateElementStyling({ fontSize: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="16px"
            />
          </div>

          {/* Font Weight */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Weight
            </label>
            <select
              value={
                getCurrentStyling("fontWeight") ||
                selectedElement.styling?.fontWeight ||
                "normal"
              }
              onChange={(e) =>
                updateElementStyling({ fontWeight: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="900">900</option>
            </select>
          </div>

          {/* Width */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width
            </label>
            <input
              type="text"
              value={
                getCurrentStyling("width") ||
                selectedElement.styling?.width ||
                "auto"
              }
              onChange={(e) => updateElementStyling({ width: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="auto"
            />
          </div>

          {/* Height */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height
            </label>
            <input
              type="text"
              value={
                getCurrentStyling("height") ||
                selectedElement.styling?.height ||
                "auto"
              }
              onChange={(e) => updateElementStyling({ height: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
