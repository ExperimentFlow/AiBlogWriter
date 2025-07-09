import React from 'react';
import { useElementSelection, SelectableElement as SelectableElementType } from './contexts/ElementSelectionContext';

interface SelectableElementProps {
  element: SelectableElementType;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isPreview?: boolean;
}

export const SelectableElement: React.FC<SelectableElementProps> = ({
  element,
  children,
  className = '',
  style = {},
  isPreview = false
}) => {
  const { selectedElement, setSelectedElement, hoveredElement, setHoveredElement } = useElementSelection();

  const isSelected = selectedElement?.id === element.id;
  const isHovered = hoveredElement?.id === element.id;

  const handleClick = (e: React.MouseEvent) => {
    if (!isPreview) return; // Only allow selection in preview mode
    e.stopPropagation();
    setSelectedElement(element);
  };

  const handleMouseEnter = () => {
    if (!isPreview) return; // Only show hover in preview mode
    setHoveredElement(element);
  };

  const handleMouseLeave = () => {
    if (!isPreview) return; // Only handle hover in preview mode
    setHoveredElement(null);
  };

  const getSelectionStyles = () => {
    const baseStyles: React.CSSProperties = {
      position: 'relative',
      transition: 'all 0.2s ease',
      ...style,
    };

    // Only add selection styles in preview mode
    if (isPreview) {
      baseStyles.cursor = 'pointer';
      
      if (isSelected) {
        return {
          ...baseStyles,
          outline: '2px solid #3b82f6',
          outlineOffset: '2px',
          boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)',
        };
      }

      if (isHovered) {
        return {
          ...baseStyles,
          outline: '2px dashed #6b7280',
          outlineOffset: '2px',
        };
      }
    }

    return baseStyles;
  };

  return (
    <div
      className={`selectable-element ${className}`}
      style={getSelectionStyles()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {children}
      
      {/* Selection indicator - only show in preview mode */}
      {isPreview && (isSelected || isHovered) && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            backgroundColor: isSelected ? '#3b82f6' : '#6b7280',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 'bold',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          {element.type.replace('-', ' ')}
        </div>
      )}
    </div>
  );
}; 