import React from "react";
import { ColorInput, TextInput, SliderInput } from "../utils/controlElements";
import { useCheckoutBuilder } from "../contexts/CheckoutBuilderContext";
import { getNestedValue, updateNestedObject } from "../utils/configUtils";

interface OrderSummaryPanelProps {
  path: string;
}

const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({ path }) => {
  const { config, setConfig } = useCheckoutBuilder();
  const sectionData = getNestedValue(config, path) || {};
  const styling = sectionData.styling || {};

  const handleStylingUpdate = (updates: Record<string, string | number>) => {
    const updatedConfig = updateNestedObject(config, `${path}.styling`, {
      ...styling,
      ...updates,
    });
    setConfig(updatedConfig);
  };

  // Dedicated handler for updating the section's title
  const handleTitleUpdate = (value: string) => {
    const updatedConfig = updateNestedObject(config, `${path}.title`, value);
    setConfig(updatedConfig);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary Settings
      </h3>

      {/* Section Title */}
      <TextInput
        label="Section Title"
        value={sectionData.title || "Order Summary"}
        onChange={handleTitleUpdate}
        placeholder="Enter section title"
      />

      {/* Background and Text Colors */}
      <ColorInput
        label="Section Background Color"
        value={styling.backgroundColor || "#ffffff"}
        onChange={(value) => handleStylingUpdate({ backgroundColor: value })}
      />
      <ColorInput
        label="Text Color"
        value={styling.color || "#111111"}
        onChange={(value) => handleStylingUpdate({ color: value })}
      />

      {/* Layout Controls */}
      <SliderInput
        label="Padding"
        value={`${styling.padding || 16}px`}
        min={0}
        max={50}
        step={4}
        unit="px"
        onChange={(value) =>
          handleStylingUpdate({ padding: parseInt(value, 10) })
        }
      />
      <SliderInput
        label="Margin"
        value={`${styling.margin || 0}px`}
        min={0}
        max={50}
        step={4}
        unit="px"
        onChange={(value) =>
          handleStylingUpdate({ margin: parseInt(value, 10) })
        }
      />
      <SliderInput
        label="Border Radius"
        value={`${styling.borderRadius || 8}px`}
        min={0}
        max={20}
        step={2}
        unit="px"
        onChange={(value) =>
          handleStylingUpdate({ borderRadius: parseInt(value, 10) })
        }
      />
      <SliderInput
        label="Gap Between Elements"
        value={`${styling.gap || 12}px`}
        min={0}
        max={30}
        step={2}
        unit="px"
        onChange={(value) =>
          handleStylingUpdate({ gap: parseInt(value, 10) })
        }
      />

      {/* Typography */}
      <SliderInput
        label="Font Size"
        value={`${styling.fontSize || 16}px`}
        min={12}
        max={24}
        step={1}
        unit="px"
        onChange={(value) =>
          handleStylingUpdate({ fontSize: parseInt(value, 10) })
        }
      />

      {/* Border Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Border
        </label>
        <TextInput
          value={styling.border || "1px solid #e5e7eb"}
          onChange={(value) => handleStylingUpdate({ border: value })}
          placeholder="1px solid #e5e7eb"
        />
        <p className="text-xs text-gray-500 mt-1">
          Format: width style color
        </p>
      </div>
    </div>
  );
};

export default OrderSummaryPanel;