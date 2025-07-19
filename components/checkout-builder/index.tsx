"use client";

import React, { useState } from "react";
import { defaultCheckoutConfig } from "./config/defaultConfig";
import { LivePreviewLayout } from "./LivePreviewLayout";
import { ElementStylingPanel } from "./ElementStylingPanel";
import {
  ElementSelectionProvider,
  useElementSelection,
} from "./contexts/ElementSelectionContext";
import { CheckoutBuilderProvider, useCheckoutBuilder } from "./contexts/CheckoutBuilderContext";
import { ProductSelector } from "./ProductSelector";

const CheckoutBuilderContent = () => {
  const [checkoutConfig, setCheckoutConfig] = useState(defaultCheckoutConfig);

  const handleConfigChange = (newConfig: any) => {
    setCheckoutConfig(newConfig);
  };

  return (
    <CheckoutBuilderProvider
      initialConfig={checkoutConfig}
      isPreview={true}
      onConfigChange={handleConfigChange}
    >
      <CheckoutBuilderInner />
    </CheckoutBuilderProvider>
  );
};

const CheckoutBuilderInner = () => {
  const { selectedElement } = useElementSelection();
  const { selectedProducts, setSelectedProducts } = useCheckoutBuilder();

  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Configuration Panel */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Product Selector - always shown */}
       
        
        {/* Element Styling Panel - shown when element is selected */}
        {selectedElement ? (
          <ElementStylingPanel
            selectedElement={selectedElement}
          />
        ) : (
          <ProductSelector
          selectedProducts={selectedProducts}
          onProductsChange={setSelectedProducts}
        />
        )}
      </div>

      {/* Live Preview */}
      <div className="flex-1">
        <LivePreviewLayout />
      </div>
    </div>
  );
};

export const CheckoutBuilder = () => {
  return (
    <ElementSelectionProvider>
      <CheckoutBuilderContent />
    </ElementSelectionProvider>
  );
};
