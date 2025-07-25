import React from "react";
import { SelectableElement } from "./contexts/ElementSelectionContext";

// Custom slider styles
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .slider::-webkit-slider-track {
    background: #e5e7eb;
    height: 8px;
    border-radius: 4px;
  }
  
  .slider::-moz-range-track {
    background: #e5e7eb;
    height: 8px;
    border-radius: 4px;
  }
`;

import {
  FileText,
  Package,
  Type,
  Circle,
  BarChart3,
  Layout,
  ShoppingCart,
  Palette,
  Settings,
} from "lucide-react";
// style pannel imported from index.ts reuseable
import {
  CheckoutPagePanel,
  LayoutItemPanel,
  SectionPanel,
  FieldPanel,
  OrderSummaryPanel,
  PricingModelPanel,
  OrderTotalsPanel,
  CouponPanel
} from "./style-panel";

interface ElementStylingPanelProps {
  selectedElement: SelectableElement | null;
}

// --- Main Panel Component ---
export const ElementStylingPanel: React.FC<ElementStylingPanelProps> = ({
  selectedElement,
}) => {
  if (!selectedElement) {
    return (
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Element Styling</h3>
        <p className="text-gray-500 text-sm">
          Click on any element in the preview to customize its styling and text
          content.
        </p>
      </div>
    );
  }

  const getElementIcon = (type: SelectableElement["type"]) => {
    switch (type) {
      case "header":
        return <FileText className="w-6 h-6 text-blue-500" />;
      case "section":
        return <Package className="w-6 h-6 text-blue-500" />;
      case "field":
        return <Type className="w-6 h-6 text-blue-500" />;
      case "button":
        return <Circle className="w-6 h-6 text-blue-500" />;
      case "progress-bar":
        return <BarChart3 className="w-6 h-6 text-blue-500" />;
      case "layout":
        return <Layout className="w-6 h-6 text-blue-500" />;
      case "product-summary":
        return <ShoppingCart className="w-6 h-6 text-blue-500" />;
      case "checkout-page":
        return <Settings className="w-6 h-6 text-blue-500" />;
      default:
        return <Palette className="w-6 h-6 text-blue-500" />;
    }
  };

  const panelMap: { [key in SelectableElement["type"]]?: React.FC<any> } = {
    "checkout-page": CheckoutPagePanel,
    layout: LayoutItemPanel,
    section: SectionPanel,
    field: FieldPanel,
    "product-summary": OrderSummaryPanel,
    "pricing-model": PricingModelPanel,
    "order-totals": OrderTotalsPanel,
    "coupon-field": CouponPanel,
  };

  const CurrentPanel = selectedElement ? panelMap[selectedElement.type] : null;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm max-h-[calc(100vh-2rem)] overflow-y-auto">
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
      <div className="flex items-center gap-2 mb-4">
        {getElementIcon(selectedElement.type)}
        <div>
          <h3 className="text-lg font-semibold">{selectedElement.label} </h3>
          <p className="text-sm text-gray-500 capitalize">
            {selectedElement.type.replace("-", " ")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {CurrentPanel ? (
          <CurrentPanel
            selectedElement={selectedElement}
            path={selectedElement.path}
            stepIndex={selectedElement.path.match(/steps\[(\d+)\]/)?.[1]}
            sectionIndex={selectedElement.path.match(/sections\[(\d+)\]/)?.[1]}
            fieldId={selectedElement.path.match(/fields\[([^\]]+)\]/)?.[3]}
            sectionId={selectedElement.id.replace("section-", "")}
          />
        ) : (
          <p className="text-gray-500">No styling options for this element.</p>
        )}
      </div>
    </div>
  );
};
