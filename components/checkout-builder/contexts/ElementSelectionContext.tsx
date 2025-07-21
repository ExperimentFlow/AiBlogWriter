import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SelectableElement {
  id: string;
  type:
    | "product-summary"
    | "button"
    | "header"
    | "section"
    | "field"
    | "progress-bar"
    | "layout"
    | "order-totals"
    | "checkout-page"
    | "pricing-model"
    | "order-totals";
  label: string;
  subtitle?: string;
  description?: string;
  path: string;
  styling?: { [key: string]: any };
}

interface ElementSelectionContextType {
  selectedElement: SelectableElement | null;
  setSelectedElement: (element: SelectableElement | null) => void;
  hoveredElement: SelectableElement | null;
  setHoveredElement: (element: SelectableElement | null) => void;
}

const ElementSelectionContext = createContext<
  ElementSelectionContextType | undefined
>(undefined);

export const useElementSelection = () => {
  const context = useContext(ElementSelectionContext);
  if (context === undefined) {
    throw new Error(
      "useElementSelection must be used within an ElementSelectionProvider"
    );
  }
  return context;
};

interface ElementSelectionProviderProps {
  children: ReactNode;
}

// Default checkout page element
const defaultCheckoutPageElement: SelectableElement = {
  id: "checkout-page",
  type: "checkout-page",
  label: "Checkout Page",
  subtitle: "Main checkout page layout",
  path: "checkoutConfig",
  styling: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: "32px",
    margin: "0",
    borderRadius: "0px",
    border: "none",
    fontSize: "16px",
    fontWeight: "400",
  },
};

export const ElementSelectionProvider: React.FC<
  ElementSelectionProviderProps
> = ({ children }) => {
  const [selectedElement, setSelectedElement] =
    useState<SelectableElement | null>(null);
  const [hoveredElement, setHoveredElement] =
    useState<SelectableElement | null>(null);

  return (
    <ElementSelectionContext.Provider
      value={{
        selectedElement,
        setSelectedElement,
        hoveredElement,
        setHoveredElement,
      }}
    >
      {children}
    </ElementSelectionContext.Provider>
  );
};
