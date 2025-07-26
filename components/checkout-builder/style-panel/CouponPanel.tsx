import React from "react";
import { ColorInput, TextInput } from "../utils/controlElements";
import { useCheckoutBuilder } from "../contexts/CheckoutBuilderContext";

interface CouponPanelProps {
  path: string;
}

const CouponPanel: React.FC<CouponPanelProps> = ({ path }) => {
  const { config, setConfig } = useCheckoutBuilder();
  const couponStyling = config.checkoutConfig.couponField?.styling || {};

  // Handlers for updating config
  const handleStylingUpdate = (section: string, updates: Record<string, string>) => {
    const currentSectionStyling = couponStyling[section] || {};
    const updatedStyling = {
      ...currentSectionStyling,
      ...updates,
    };
    setConfig({
      ...config,
      checkoutConfig: {
        ...config.checkoutConfig,
        couponField: {
          ...config.checkoutConfig.couponField,
          styling: {
            ...couponStyling,
            [section]: updatedStyling,
          },
        },
      },
    });
  };

  const handleFieldBgUpdate = (value: string) => {
    setConfig({
      ...config,
      checkoutConfig: {
        ...config.checkoutConfig,
        couponField: {
          ...config.checkoutConfig.couponField,
          styling: {
            ...couponStyling,
            backgroundColor: value,
          },
        },
      },
    });
  };

  const handleTitleUpdate = (value: string) => {
    setConfig({
      ...config,
      checkoutConfig: {
        ...config.checkoutConfig,
        couponField: {
          ...config.checkoutConfig.couponField,
          styling: {
            ...couponStyling,
            title: {
              ...(couponStyling.title || {}),
              text: value,
            },
          },
        },
      },
    });
  };

  const handleTitleColorUpdate = (value: string) => {
    setConfig({
      ...config,
      checkoutConfig: {
        ...config.checkoutConfig,
        couponField: {
          ...config.checkoutConfig.couponField,
          styling: {
            ...couponStyling,
            title: {
              ...(couponStyling.title || {}),
              color: value,
            },
          },
        },
      },
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Coupon Field Settings</h3>
      <TextInput
        label="Title"
        value={couponStyling.title?.text || "Discount Code"}
        onChange={handleTitleUpdate}
        placeholder="Discount Code"
      />
      <ColorInput
        label="Title Color"
        value={couponStyling.title?.color || "#111"}
        onChange={handleTitleColorUpdate}
      />
      <ColorInput
        label="Full Field Background"
        value={couponStyling.backgroundColor || "#fff"}
        onChange={handleFieldBgUpdate}
      />
      <ColorInput
        label="Input Field Background"
        value={couponStyling.input?.backgroundColor || "#fff"}
        onChange={val => handleStylingUpdate("input", { backgroundColor: val })}
      />
      <ColorInput
        label="Input Border Color"
        value={couponStyling.input?.borderColor || "#e5e7eb"}
        onChange={val => handleStylingUpdate("input", { borderColor: val })}
      />
      <ColorInput
        label="Apply Button Background"
        value={couponStyling.button?.backgroundColor || "#2563eb"}
        onChange={val => handleStylingUpdate("button", { backgroundColor: val })}
      />
      <ColorInput
        label="Apply Button Text Color"
        value={couponStyling.button?.textColor || "#fff"}
        onChange={val => handleStylingUpdate("button", { textColor: val })}
      />
      <TextInput
        label="Apply Button Text"
        value={couponStyling.button?.text || "Apply"}
        onChange={val => handleStylingUpdate("button", { text: val })}
        placeholder="Apply"
      />
    </div>
  );
};

export default CouponPanel;
