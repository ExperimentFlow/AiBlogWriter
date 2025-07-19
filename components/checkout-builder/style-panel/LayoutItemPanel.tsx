import React from "react";
import { ColorInput, SliderInput, SelectInput } from "../utils/controlElements";
import { useCheckoutBuilder } from "../contexts/CheckoutBuilderContext";
import { getNestedValue, updateNestedObject } from "../utils/configUtils";
import { useElementSelection } from "../contexts/ElementSelectionContext";

const LayoutItemPanel = () => {
  const { config, setConfig } = useCheckoutBuilder();
  const { selectedElement } = useElementSelection();

  if (!selectedElement) return null;

  // Get current styling for the selected element
  const currentStyling =
    getNestedValue(config, selectedElement.path) || {};

  const handleUpdate = (updates: any) => {
    console.log('updates', updates)
    const updatedConfig = updateNestedObject(
      config,
      selectedElement.path,
      { ...currentStyling, ...updates }
    );
    setConfig(updatedConfig);
  };

  return (
    <div>
      <h3 className="text-md font-semibold mb-4">
        {selectedElement.label} Styling
      </h3>
      <ColorInput
        label="Background Color"
        value={currentStyling.backgroundColor}
        onChange={(value) => handleUpdate({ backgroundColor: value })}
      />
      <ColorInput
        label="Primary Color"
        value={currentStyling.primaryColor}
        onChange={(value) => handleUpdate({ primaryColor: value })}
      />
      <ColorInput
        label="Secondary Color"
        value={currentStyling.secondaryColor}
        onChange={(value) => handleUpdate({ secondaryColor: value })}
      />
      <ColorInput
        label="Border Color"
        value={currentStyling.borderColor}
        onChange={(value) => handleUpdate({ borderColor: value })}
      />
      <SelectInput
        label="Border Style"
        value={currentStyling.borderStyle}
        options={[
          { value: "solid", label: "Solid" },
          { value: "dashed", label: "Dashed" },
          { value: "dotted", label: "Dotted" },
          { value: "double", label: "Double" },
          { value: "none", label: "None" },
        ]}
        onChange={(value) => handleUpdate({ borderStyle: value })}
      />
      <SliderInput
        label="Border Width"
        value={`${currentStyling.borderWidth}px`}
        min={0}
        max={10}
        step={1}
        unit="px"
        onChange={(value) =>
          handleUpdate({ borderWidth: parseInt(value.replace("px", "")) })
        }
      />
      <SliderInput
        label="Border Radius"
        value={`${currentStyling.borderRadius}px`}
        min={0}
        max={64}
        step={2}
        unit="px"
        onChange={(value) =>
          handleUpdate({ borderRadius: parseInt(value.replace("px", "")) })
        }
      />
      <SliderInput
        label="Margin"
        value={`${currentStyling.margin}px`}
        min={0}
        max={64}
        step={2}
        unit="px"
        onChange={(value) =>
          handleUpdate({ margin: parseInt(value.replace("px", "")) })
        }
      />
      <SliderInput
        label="Padding"
        value={`${currentStyling.padding}px`}
        min={0}
        max={64}
        step={2}
        unit="px"
        onChange={(value) =>
          handleUpdate({ padding: parseInt(value.replace("px", "")) })
        }
      />
    </div>
  );
};

export default LayoutItemPanel;
