"use client";

import React, { useState } from "react";
import { defaultCheckoutConfig } from "./config/defaultConfig";
import { LivePreviewLayout } from "./LivePreviewLayout";
import { ConfigurationPanel } from "./ConfigurationPanel";
import { ElementStylingPanel } from "./ElementStylingPanel";
import {
  ElementSelectionProvider,
  useElementSelection,
} from "./contexts/ElementSelectionContext";

const CheckoutBuilderContent = () => {
  const [checkoutConfig, setCheckoutConfig] = useState(defaultCheckoutConfig);
  const { selectedElement } = useElementSelection();

  const handleConfigChange = (newConfig: any) => {
    setCheckoutConfig(newConfig);
  };

  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Configuration Panel */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Element Styling Panel - shown when element is selected */}
        {selectedElement ? (
          <ElementStylingPanel
            selectedElement={selectedElement}
            config={checkoutConfig}
            onConfigChange={handleConfigChange}
          />
        ) : (
          <ConfigurationPanel
            config={checkoutConfig}
            onConfigChange={handleConfigChange}
          />
        )}
      </div>

      {/* Live Preview */}
      <div className="flex-1">
        <LivePreviewLayout
          config={checkoutConfig}
          onConfigChange={handleConfigChange}
        />
      </div>
    </div>
  );
};

const CheckoutBuilder = () => {
  return (
    <ElementSelectionProvider>
      <CheckoutBuilderContent />
    </ElementSelectionProvider>
  );
};

export default CheckoutBuilder;
