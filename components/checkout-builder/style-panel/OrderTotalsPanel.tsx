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

  // Get current styling and values for the order totals, with robust defaults
  // Dynamic defaults: use config value if present, else fallback to default
  const defaultStyling = {
    backgroundColor: "#fff",
    color: "#111",
    padding: "16px",
    margin: "0px",
    borderRadius: "8px",
    gap: "12px",
    fontSize: "16px",
    border: "1px solid #e5e7eb",
  };
  const defaultTotals = {
    subtotal: { label: "Subtotal", value: "$0.00", textColor: "#111", bgColor: "#fff", primaryColor: "#2563eb" },
    shipping: { label: "Shipping", value: "$5.99", textColor: "#111", bgColor: "#fff", primaryColor: "#2563eb" },
    tax: { label: "Tax", value: "$0.00", textColor: "#111", bgColor: "#fff", primaryColor: "#2563eb" },
    pricingModel: { label: "Pricing Model", value: "One-Time Payment", textColor: "#111", bgColor: "#fff", primaryColor: "#2563eb" },
    total: { label: "Total", value: "$5.99", textColor: "#111", bgColor: "#fff", primaryColor: "#2563eb" },
  };

  // Use config value if present, else fallback to default
  const configStylingRaw = getNestedValue(config, path + ".styling") || {};
  const configTotalsRaw = getNestedValue(config, path + ".totals") || {};
  const currentStyling = { ...defaultStyling, ...configStylingRaw };
  const currentTotals = { ...defaultTotals, ...configTotalsRaw };

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
    // Only update the raw config values, not the merged defaults
    const updatedStyling = {
      ...configStylingRaw,
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

export default OrderTotalsPanel;
