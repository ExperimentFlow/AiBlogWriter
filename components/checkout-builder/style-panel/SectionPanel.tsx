import { ColorInput, TextInput, SliderInput } from "../utils/controlElements";
import { useCheckoutBuilder } from "../contexts/CheckoutBuilderContext";
import { getNestedValue, updateNestedObject } from "../utils/configUtils";
import { useElementSelection } from "../contexts/ElementSelectionContext";

interface SectionPanelProps {
  stepIndex: number;
  sectionIndex: number;
  sectionId: string;
}

const SectionPanel: React.FC<SectionPanelProps> = ({
  stepIndex,
  sectionIndex,
  sectionId,
}) => {
  const { config, setConfig } = useCheckoutBuilder();
  const { selectedElement } = useElementSelection();

  if (!selectedElement) return null;

  // Create dynamic path for the section
  const stylingPath = `steps[${stepIndex}].sections[${sectionIndex}].styling`;

  // Get current section and styling values
  const section = config.steps[stepIndex]?.sections[sectionIndex];

  const currentStyling = getNestedValue(config, stylingPath) || {};

  const handleSectionUpdate = (updates: Partial<typeof section>) => {
    const updatedConfig = updateNestedObject(config, stylingPath, {
      ...section,
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

  if (!section) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Section not found</p>
      </div>
    );
  }

  console.log("currentStyling", currentStyling);
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Section Settings
      </h3>

      {/* Section Title */}
      <TextInput
        label="Section Title"
        value={section.title || ""}
        onChange={(value) => handleSectionUpdate({ title: value })}
        placeholder="Enter section title"
      />

      {/* Section Background Color */}
      <ColorInput
        label="Section Background Color"
        value={currentStyling.backgroundColor}
        onChange={(value) => handleStylingUpdate({ backgroundColor: value })}
      />

      {/* Title Color */}
      <ColorInput
        label="Title Color"
        value={currentStyling.color}
        onChange={(value) => handleStylingUpdate({ color: value })}
      />

 
      {/* Padding */}
      <SliderInput
        label="Padding"
        value={currentStyling.padding || "16px"}
        min={0}
        max={50}
        step={4}
        unit="px"
        onChange={(value) => handleStylingUpdate({ padding: value })}
      />

      {/* Margin */}
      <SliderInput
        label="Margin"
        value={currentStyling.margin || "0px"}
        min={0}
        max={50}
        step={4}
        unit="px"
        onChange={(value) => handleStylingUpdate({ margin: value })}
      />

      {/* Border Radius */}
      <SliderInput
        label="Border Radius"
        value={currentStyling.borderRadius || "8px"}
        min={0}
        max={20}
        step={2}
        unit="px"
        onChange={(value) => handleStylingUpdate({ borderRadius: value })}
      />

      {/* Gap Between Elements */}
      <SliderInput
        label="Gap Between Elements"
        value={currentStyling.gap || "12px"}
        min={0}
        max={30}
        step={2}
        unit="px"
        onChange={(value) => handleStylingUpdate({ gap: value })}
      />

      {/* Font Size */}
      <SliderInput
        label="Font Size"
        value={currentStyling.fontSize || "16px"}
        min={12}
        max={24}
        step={1}
        unit="px"
        onChange={(value) => handleStylingUpdate({ fontSize: value })}
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
    </div>
  );
};

export default SectionPanel;
