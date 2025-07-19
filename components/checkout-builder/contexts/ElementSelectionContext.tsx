import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SelectableElement {
  id: string;
  type:
    | "header"
    | "section"
    | "field"
    | "button"
    | "progress-bar"
    | "layout"
    | "product-summary"
    | "order-totals"
    | "checkout-page";
  label: string;
  path: string; // Path to the element in the config structure
  placeholder?: string;
  description?: string;
  buttonText?: string;
  subtitle?: string;
  styling?: {
    backgroundColor?: string;
    color?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    border?: string;
    fontSize?: string;
    fontWeight?: string;
    width?: string;
    height?: string;
    gap?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    inputColor?: string;
    placeholderColor?: string;
    inputTextColor?: string;
    inputBackgroundColor?: string;
    inputGap?: string;
    customCSS?: string;
  };
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
