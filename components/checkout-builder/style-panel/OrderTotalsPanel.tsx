import React, { useEffect } from "react";
import { ColorInput, TextInput, SliderInput } from "../utils/controlElements";
import { useCheckoutBuilder } from "../contexts/CheckoutBuilderContext";
import { getNestedValue, updateNestedObject } from "../utils/configUtils";
import { useElementSelection } from "../contexts/ElementSelectionContext";

interface OrderTotalsPanelProps {
  path: string;
}

const OrderTotalsPanel: React.FC<OrderTotalsPanelProps> = ({ path }) => {
  const { config, setConfig } = useCheckoutBuilder();
  const { selectedElement } = useElementSelection();

  if (!selectedElement) return null;

  // Section-level default styling
  const DEFAULTS = {
    backgroundColor: "#fff",
    color: "#111",
    padding: "16px",
    margin: "0px",
    borderRadius: "8px",
    gap: "12px",
    fontSize: "16px",
    border: "1px solid #e5e7eb",
  };

  // Get current styling and values for the order totals
  const currentStyling = getNestedValue(config, path + ".styling") || {};
  const currentTotals = getNestedValue(config, path + ".totals") || {
    subtotal: { label: "Subtotal", value: "$0.00" },
    shipping: { label: "Shipping", value: "$5.99" },
    tax: { label: "Tax", value: "$0.00" },
    pricingModel: { label: "Pricing Model", value: "One-Time Payment" },
    total: { label: "Total", value: "$5.99" },
  };

  // Set initial section styling values in config if missing
  useEffect(() => {
    const updates: any = {};
    if (typeof currentStyling.backgroundColor !== "string") updates.backgroundColor = DEFAULTS.backgroundColor;
    if (typeof currentStyling.color !== "string") updates.color = DEFAULTS.color;
    if (typeof currentStyling.padding !== "string") updates.padding = DEFAULTS.padding;
    if (typeof currentStyling.margin !== "string") updates.margin = DEFAULTS.margin;
    if (typeof currentStyling.borderRadius !== "string") updates.borderRadius = DEFAULTS.borderRadius;
    if (typeof currentStyling.gap !== "string") updates.gap = DEFAULTS.gap;
    if (typeof currentStyling.fontSize !== "string") updates.fontSize = DEFAULTS.fontSize;
    if (typeof currentStyling.border !== "string") updates.border = DEFAULTS.border;
    if (Object.keys(updates).length > 0) {
      setConfig(updateNestedObject(config, path + ".styling", { ...currentStyling, ...updates }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTotalsUpdate = (key: string, updates: Partial<typeof currentTotals["subtotal"]>) => {
    const updatedTotals = {
      ...currentTotals,
      [key]: {
        ...currentTotals[key],
        ...updates,
      },
    };
    const updatedConfig = updateNestedObject(config, path + ".totals", updatedTotals);
    setConfig(updatedConfig);
  };

  const handleStylingUpdate = (updates: Partial<typeof currentStyling>) => {
    const updatedStyling = {
      ...currentStyling,
      ...updates,
    };
    const updatedConfig = updateNestedObject(config, path + ".styling", updatedStyling);
    setConfig(updatedConfig);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Totals Settings</h3>
      {/* Section Styling Controls */}
      <h3 className="text-md font-semibold text-gray-800 mb-2 mt-6">Section Styling</h3>
      <ColorInput
        label="Section Background Color"
        value={currentStyling.backgroundColor}
        onChange={(value) => handleStylingUpdate({ backgroundColor: value })}
      />
      <ColorInput
        label="Title Color"
        value={currentStyling.color}
        onChange={(value) => handleStylingUpdate({ color: value })}
      />
      <SliderInput
        label="Padding"
        value={currentStyling.padding}
        min={0}
        max={50}
        step={4}
        unit="px"
        onChange={(value) => handleStylingUpdate({ padding: value })}
      />
      <SliderInput
        label="Margin"
        value={currentStyling.margin}
        min={0}
        max={50}
        step={4}
        unit="px"
        onChange={(value) => handleStylingUpdate({ margin: value })}
      />
      <SliderInput
        label="Border Radius"
        value={currentStyling.borderRadius}
        min={0}
        max={20}
        step={2}
        unit="px"
        onChange={(value) => handleStylingUpdate({ borderRadius: value })}
      />
      <SliderInput
        label="Gap Between Elements"
        value={currentStyling.gap}
        min={0}
        max={30}
        step={2}
        unit="px"
        onChange={(value) => handleStylingUpdate({ gap: value })}
      />
      <SliderInput
        label="Font Size"
        value={currentStyling.fontSize}
        min={12}
        max={24}
        step={1}
        unit="px"
        onChange={(value) => handleStylingUpdate({ fontSize: value })}
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Border
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={currentStyling.border}
            onChange={(e) => handleStylingUpdate({ border: e.target.value })}
            placeholder={DEFAULTS.border}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Format: width style color (e.g., "1px solid #e5e7eb")
        </p>
      </div>

      {(Object.entries(currentTotals) as [string, {
        label: string;
        value: string;
        textColor: string;
        bgColor: string;
        primaryColor: string;
      }][]).map(([key, item]) => (
        <div key={key} className="mb-6 p-3 rounded border border-gray-200 bg-gray-50">
          <div className="mb-2">
            <TextInput
              label="Label"
              value={item.label}
              onChange={(val) => handleTotalsUpdate(key, { label: val })}
              placeholder="Label"
            />
          </div>
          <div className="mb-2">
            <TextInput
              label="Value"
              value={item.value}
              onChange={(val) => handleTotalsUpdate(key, { value: val })}
              placeholder="Value"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTotalsPanel;
