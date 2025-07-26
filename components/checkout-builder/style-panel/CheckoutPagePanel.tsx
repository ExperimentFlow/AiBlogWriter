import {
  ColorInput,
  SelectInput,
  SwitchInput,
  TextInput,
  SliderInput,
} from "../utils/controlElements";
import { useCheckoutBuilder } from "../contexts/CheckoutBuilderContext";
import {
  updateCheckoutConfig,
  updateTheme,
  updateLayout,
} from "../utils/configUtils";
import { ArrowLeftRight } from "lucide-react";
const CheckoutPagePanel = () => {
  const { config, setConfig } = useCheckoutBuilder();

  const handleConfigUpdate = (
    updates: Partial<typeof config.checkoutConfig>
  ) => {
    const updatedConfig = updateCheckoutConfig(config, updates);
    setConfig(updatedConfig);
  };

  const handleThemeUpdate = (
    updates: Partial<typeof config.checkoutConfig.theme>
  ) => {
    const updatedConfig = updateTheme(config, updates);
    setConfig(updatedConfig);
  };

  const handleLayoutUpdate = (
    updates: Partial<typeof config.checkoutConfig.layout>
  ) => {
    const updatedConfig = updateLayout(config, updates);
    setConfig(updatedConfig);
  };

  const handleTwoColumnUpdate = (
    updates: Partial<typeof config.checkoutConfig.layout.twoColumn> = {}
  ) => {
    const current = config.checkoutConfig.layout.twoColumn!;
    const updatedConfig = updateLayout(config, {
      twoColumn: {
        ...current,
        ...updates,
        gap: updates.gap !== undefined ? updates.gap : current.gap,
      },
    });
    setConfig(updatedConfig);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Checkout Page Settings
      </h3>
      {/* Page Title */}
      <TextInput
        label="Page Title"
        value={config.checkoutConfig.name}
        onChange={(value) => handleConfigUpdate({ name: value })}
        placeholder="Enter page title"
      />

      {/* Background Color */}
      <ColorInput
        label="Background Color"
        value={config.checkoutConfig.theme.backgroundColor}
        onChange={(value) => handleThemeUpdate({ backgroundColor: value })}
      />

      {/* Layout Type */}
      <SelectInput
        label="Layout Type"
        value={config.checkoutConfig.layout.type}
        options={[
          { value: "one_column", label: "Single Column" },
          { value: "two_column", label: "Two Column" },
        ]}
        onChange={(value) =>
          handleLayoutUpdate({ type: value as "one_column" | "two_column" })
        }
      />

      {/* Swap Columns - Only show for two column layout */}
      {config.checkoutConfig.layout.type === "two_column" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Column Content
          </label>
          <button
            onClick={() => {
              const current = config.checkoutConfig.layout.twoColumn!;
              const updatedConfig = updateLayout(config, {
                twoColumn: {
                  ...current,
                  leftColumn: {
                    ...current.rightColumn,
                    width: current.leftColumn.width, // keep widths
                  },
                  rightColumn: {
                    ...current.leftColumn,
                    width: current.rightColumn.width, // keep widths
                  },
                },
              });
              setConfig(updatedConfig);
            }}
            className="w-full cursor-pointer flex items-center justify-center px-3 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" /> <p>Swap Columns</p>
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Current: Left ={" "}
            {config.checkoutConfig.layout.twoColumn?.leftColumn?.content ===
            "customer_info"
              ? "Customer Info"
              : "Product Info"}
            , Right ={" "}
            {config.checkoutConfig.layout.twoColumn?.rightColumn?.content ===
            "customer_info"
              ? "Customer Info"
              : "Product Info"}
          </p>
        </div>
      )}

      {/* Gap Between Columns - Only show for two column layout */}
      {config.checkoutConfig.layout.type === "two_column" && (
        <SliderInput
          label="Gap Between Columns"
          value={`${config.checkoutConfig.layout.twoColumn?.gap || 32}px`}
          min={0}
          max={10}
          step={4}
          unit="px"
          onChange={(value) => {
            const gapValue = parseInt(value.replace("px", ""));
            handleTwoColumnUpdate({ gap: gapValue });
          }}
        />
      )}

      {/* Column Widths - Only show for two column layout */}
      {config.checkoutConfig.layout.type === "two_column" && (
        <>
          <SliderInput
            label="Left Column Width"
            value={`${parseInt(
              config.checkoutConfig.layout.twoColumn?.leftColumn?.width || "60"
            )}%`}
            min={20}
            max={80}
            step={5}
            unit="%"
            onChange={(value) => {
              const leftWidth = value.replace("%", "");
              const rightWidth = 100 - parseInt(leftWidth);
              const current = config.checkoutConfig.layout.twoColumn!;
              const updatedConfig = updateLayout(config, {
                twoColumn: {
                  ...current,
                  leftColumn: {
                    ...current.leftColumn,
                    width: `${leftWidth}%`,
                  },
                  rightColumn: {
                    ...current.rightColumn,
                    width: `${rightWidth}%`,
                  },
                },
              });
              setConfig(updatedConfig);
            }}
          />
          <SliderInput
            label="Right Column Width"
            value={`${parseInt(
              config.checkoutConfig.layout.twoColumn?.rightColumn?.width || "40"
            )}%`}
            min={20}
            max={80}
            step={5}
            unit="%"
            onChange={(value) => {
              const rightWidth = value.replace("%", "");
              const leftWidth = 100 - parseInt(rightWidth);
              const current = config.checkoutConfig.layout.twoColumn!;
              const updatedConfig = updateLayout(config, {
                twoColumn: {
                  ...current,
                  leftColumn: {
                    ...current.leftColumn,
                    width: `${leftWidth}%`,
                  },
                  rightColumn: {
                    ...current.rightColumn,
                    width: `${rightWidth}%`,
                  },
                },
              });
              setConfig(updatedConfig);
            }}
          />
        </>
      )}

      {/* Step Mode Toggle */}
      <SwitchInput
        label="Enable Step Mode"
        value={config.checkoutConfig.stepMode || false}
        onChange={(value) => handleConfigUpdate({ stepMode: value })}
        description="Show checkout as separate steps instead of all at once"
      />

      {/* Header Toggle */}
      <SwitchInput
        label="Show Header"
        value={config.checkoutConfig.enableHeader || false}
        onChange={(value) => handleConfigUpdate({ enableHeader: value })}
        description="Display the checkout page header"
      />
    </div>
  );
};

export default CheckoutPagePanel;
