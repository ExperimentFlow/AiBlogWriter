import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SelectableElement {
  id: string;
  type: 'header' | 'section' | 'field' | 'button' | 'progress-bar' | 'layout' | 'product-summary' | 'order-totals' | 'checkout-layout';
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
    customCSS?: string;
  };
}

interface ElementSelectionContextType {
  selectedElement: SelectableElement | null;
  setSelectedElement: (element: SelectableElement | null) => void;
  hoveredElement: SelectableElement | null;
  setHoveredElement: (element: SelectableElement | null) => void;
}

const ElementSelectionContext = createContext<ElementSelectionContextType | undefined>(undefined);

export const useElementSelection = () => {
  const context = useContext(ElementSelectionContext);
  if (context === undefined) {
    throw new Error('useElementSelection must be used within an ElementSelectionProvider');
  }
  return context;
};

interface ElementSelectionProviderProps {
  children: ReactNode;
}

export const ElementSelectionProvider: React.FC<ElementSelectionProviderProps> = ({ children }) => {
  const [selectedElement, setSelectedElement] = useState<SelectableElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<SelectableElement | null>(null);

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