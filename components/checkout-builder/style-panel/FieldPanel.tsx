import {
  ColorInput,
  TextInput,
  SliderInput,
  SelectInput,
  SwitchInput,
} from "../utils/controlElements";
import { useCheckoutBuilder } from "../contexts/CheckoutBuilderContext";
import { getNestedValue, updateNestedObject } from "../utils/configUtils";
import { useElementSelection } from "../contexts/ElementSelectionContext";

interface FieldPanelProps {
  stepIndex: number;
  sectionIndex: number;
  fieldId: string;
}

const FieldPanel: React.FC<FieldPanelProps> = ({
  stepIndex,
  sectionIndex,
  fieldId,
}) => {
  const { config, setConfig } = useCheckoutBuilder();
  const { selectedElement } = useElementSelection();

  if (!selectedElement) return null;

  // Find the field index by ID
  const section = config.steps[stepIndex]?.sections[sectionIndex];
  const fieldIndex = section?.fields?.findIndex(field => field.id === fieldId) ?? -1;
  
  if (fieldIndex === -1) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Field not found</p>
      </div>
    );
  }

  // Create dynamic path for the field
  const fieldPath = `steps[${stepIndex}].sections[${sectionIndex}].fields[${fieldIndex}]`;
  const stylingPath = `${fieldPath}.styling`;

  // Get current field and styling values
  const field = section?.fields[fieldIndex];
  const currentStyling = getNestedValue(config, stylingPath) || {};

  const handleFieldUpdate = (updates: Partial<typeof field>) => {
    const updatedConfig = updateNestedObject(config, fieldPath, {
      ...field,
      ...updates,
    });
    setConfig(updatedConfig);
  };

  const handleStylingUpdate = (updates: Partial<typeof currentStyling>) => {
    const updatedStyling = {
      ...currentStyling,
      ...updates,
    };
    const updatedConfig = updateNestedObject(
      config,
      stylingPath,
      updatedStyling
    );
    setConfig(updatedConfig);
  };

  if (!field) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Field not found</p>
      </div>
    );
  }

  console.log("fieldStyling", currentStyling);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Field Settings
      </h3>

      {/* Field Basic Settings */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">Basic Settings</h4>
        
        <TextInput
          label="Field Label"
          value={field.label || ""}
          onChange={(value) => handleFieldUpdate({ label: value })}
          placeholder="Enter field label"
        />

        <TextInput
          label="Placeholder"
          value={field.placeholder || ""}
          onChange={(value) => handleFieldUpdate({ placeholder: value })}
          placeholder="Enter placeholder text"
        />

        <TextInput
          label="Description"
          value={field.description || ""}
          onChange={(value) => handleFieldUpdate({ description: value })}
          placeholder="Enter field description"
        />

        <SwitchInput
          label="Required Field"
          value={field.required || false}
          onChange={(value) => handleFieldUpdate({ required: value })}
          description="Make this field mandatory"
        />
      </div>

      {/* Field Styling */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">Styling</h4>

        {/* Colors */}
        <ColorInput
          label="Background Color"
          value={currentStyling.backgroundColor || "#ffffff"}
          onChange={(value) => handleStylingUpdate({ backgroundColor: value })}
        />

        <ColorInput
          label="Text Color"
          value={currentStyling.color || "#000000"}
          onChange={(value) => handleStylingUpdate({ color: value })}
        />

        <ColorInput
          label="Label Color"
          value={currentStyling.labelColor || "#374151"}
          onChange={(value) => handleStylingUpdate({ labelColor: value })}
        />

        {/* Spacing */}
        <SliderInput
          label="Padding"
          value={currentStyling.padding || "12px"}
          min={0}
          max={50}
          step={2}
          unit="px"
          onChange={(value) => handleStylingUpdate({ padding: value })}
        />

        <SliderInput
          label="Border Radius"
          value={currentStyling.borderRadius || "6px"}
          min={0}
          max={20}
          step={1}
          unit="px"
          onChange={(value) => handleStylingUpdate({ borderRadius: value })}
        />

        <SliderInput
          label="Gap"
          value={currentStyling.gap || "8px"}
          min={0}
          max={30}
          step={2}
          unit="px"
          onChange={(value) => handleStylingUpdate({ gap: value })}
        />

        {/* Typography */}
        <SliderInput
          label="Font Size"
          value={currentStyling.fontSize || "16px"}
          min={12}
          max={24}
          step={1}
          unit="px"
          onChange={(value) => handleStylingUpdate({ fontSize: value })}
        />

        <SliderInput
          label="Label Font Size"
          value={currentStyling.labelFontSize || "14px"}
          min={10}
          max={20}
          step={1}
          unit="px"
          onChange={(value) => handleStylingUpdate({ labelFontSize: value })}
        />

        {/* Border */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Border
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={currentStyling.border || "1px solid #e5e7eb"}
              onChange={(e) => handleStylingUpdate({ border: e.target.value })}
              placeholder="1px solid #e5e7eb"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Format: width style color (e.g., "1px solid #e5e7eb")
          </p>
        </div>

        {/* Dimensions */}
        <SliderInput
          label="Width"
          value={currentStyling.width || "100%"}
          min={50}
          max={100}
          step={5}
          unit="%"
          onChange={(value) => handleStylingUpdate({ width: value })}
        />

        <SliderInput
          label="Height"
          value={currentStyling.height || "auto"}
          min={30}
          max={200}
          step={5}
          unit="px"
          onChange={(value) => handleStylingUpdate({ height: value })}
        />
      </div>

      {/* Field Type Specific Settings */}
      {field.type === "select" && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">Select Options</h4>
          
          <ColorInput
            label="Option Background Color"
            value={currentStyling.optionBackgroundColor || "#ffffff"}
            onChange={(value) => handleStylingUpdate({ optionBackgroundColor: value })}
          />

          <ColorInput
            label="Selected Background Color"
            value={currentStyling.selectedBackgroundColor || "#007bff"}
            onChange={(value) => handleStylingUpdate({ selectedBackgroundColor: value })}
          />

          <SliderInput
            label="Option Padding"
            value={currentStyling.optionPadding || "8px"}
            min={4}
            max={20}
            step={2}
            unit="px"
            onChange={(value) => handleStylingUpdate({ optionPadding: value })}
          />

          <SliderInput
            label="Option Border Radius"
            value={currentStyling.optionBorderRadius || "4px"}
            min={0}
            max={15}
            step={1}
            unit="px"
            onChange={(value) => handleStylingUpdate({ optionBorderRadius: value })}
          />
        </div>
      )}

      {field.type === "checkbox" && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">Checkbox Settings</h4>
          
          <SliderInput
            label="Checkbox Size"
            value={currentStyling.checkboxSize || "16px"}
            min={12}
            max={24}
            step={2}
            unit="px"
            onChange={(value) => handleStylingUpdate({ checkboxSize: value })}
          />

          <ColorInput
            label="Checkbox Color"
            value={currentStyling.checkboxColor || "#007bff"}
            onChange={(value) => handleStylingUpdate({ checkboxColor: value })}
          />
        </div>
      )}

      {field.type === "radio" && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">Radio Settings</h4>
          
          <SliderInput
            label="Radio Size"
            value={currentStyling.iconSize || "16px"}
            min={12}
            max={24}
            step={2}
            unit="px"
            onChange={(value) => handleStylingUpdate({ iconSize: value })}
          />

          <ColorInput
            label="Radio Color"
            value={currentStyling.checkboxColor || "#007bff"}
            onChange={(value) => handleStylingUpdate({ checkboxColor: value })}
          />
        </div>
      )}

      {/* Validation Settings */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">Validation</h4>
        
        <SelectInput
          label="Validation Type"
          value={field.validation?.type || ""}
          options={[
            { value: "", label: "None" },
            { value: "required", label: "Required" },
            { value: "email", label: "Email" },
            { value: "minLength", label: "Minimum Length" },
            { value: "maxLength", label: "Maximum Length" },
            { value: "pattern", label: "Pattern" },
          ]}
          onChange={(value) => 
            handleFieldUpdate({ 
              validation: { 
                ...field.validation, 
                type: value 
              } 
            })
          }
        />

        <TextInput
          label="Error Message"
          value={field.validation?.message || ""}
          onChange={(value) => 
            handleFieldUpdate({ 
              validation: { 
                ...field.validation, 
                message: value 
              } 
            })
          }
          placeholder="Enter error message"
        />
      </div>
    </div>
  );
};

export default FieldPanel; 