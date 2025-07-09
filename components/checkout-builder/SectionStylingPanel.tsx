import React from 'react';
import { SelectableElement } from './contexts/ElementSelectionContext';
import { CheckoutConfiguration } from './types';
import { 
  Type, 
  Palette, 
  Ruler, 
  Square, 
  FileText, 
  Settings,
  Package
} from 'lucide-react';

interface SectionStylingPanelProps {
  selectedElement: SelectableElement;
  config: CheckoutConfiguration;
  onConfigChange: (config: CheckoutConfiguration) => void;
  updateElementStyling: (updates: Partial<SelectableElement['styling']>) => void;
  updateElementText: (textType: string, value: string) => void;
  getCurrentValue: (property: string) => string;
  getCurrentStyling: (property: string) => string;
}

export const SectionStylingPanel: React.FC<SectionStylingPanelProps> = ({
  selectedElement,
  updateElementStyling,
  updateElementText,
  getCurrentValue,
  getCurrentStyling
}) => {
  // Helper function to parse numeric values from CSS strings
  const parseNumericValue = (value: string, unit: string = 'px'): number => {
    const numeric = parseFloat(value.replace(/[^\d.]/g, ''));
    return isNaN(numeric) ? 0 : numeric;
  };

  // Helper function to format numeric values to CSS strings
  const formatNumericValue = (value: number, unit: string = 'px'): string => {
    return `${value}${unit}`;
  };

  // Debug logging
  console.log('SectionStylingPanel rendered:', {
    selectedElement: {
      id: selectedElement.id,
      path: selectedElement.path,
      label: selectedElement.label,
      type: selectedElement.type
    }
  });

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-6 h-6 text-blue-500" />
        <div>
          <h3 className="text-lg font-semibold">{selectedElement.label}</h3>
          <p className="text-sm text-gray-500">Section Styling</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Text Content Section */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Type className="w-4 h-4 text-gray-600" />
            <h4 className="text-md font-medium text-gray-700">Text Content</h4>
          </div>
          
          {/* Section Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={getCurrentValue('label') || selectedElement.label || ''}
              onChange={(e) => updateElementText('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter section title"
            />
          </div>

          {/* Section Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Description
            </label>
            <textarea
              value={getCurrentValue('description') || selectedElement.description || ''}
              onChange={(e) => updateElementText('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter section description"
              rows={3}
            />
          </div>
        </div>

        {/* Colors Section */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-gray-600" />
            <h4 className="text-md font-medium text-gray-700">Colors</h4>
          </div>
          
          {/* Background Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={getCurrentStyling('backgroundColor') || selectedElement.styling?.backgroundColor || '#ffffff'}
                onChange={(e) => updateElementStyling({ backgroundColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={getCurrentStyling('backgroundColor') || selectedElement.styling?.backgroundColor || '#ffffff'}
                onChange={(e) => updateElementStyling({ backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={getCurrentStyling('color') || selectedElement.styling?.color || '#333333'}
                onChange={(e) => updateElementStyling({ color: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={getCurrentStyling('color') || selectedElement.styling?.color || '#333333'}
                onChange={(e) => updateElementStyling({ color: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#333333"
              />
            </div>
          </div>
        </div>

        {/* Spacing Section */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="w-4 h-4 text-gray-600" />
            <h4 className="text-md font-medium text-gray-700">Spacing</h4>
          </div>
          
          {/* Padding */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padding ({getCurrentStyling('padding') || '16px'})
            </label>
            <input
              type="range"
              min={0}
              max={64}
              step={4}
              value={parseNumericValue(getCurrentStyling('padding') || '16px')}
              onChange={(e) => updateElementStyling({ padding: formatNumericValue(Number(e.target.value)) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span>32px</span>
              <span>64px</span>
            </div>
          </div>

          {/* Margin */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margin ({getCurrentStyling('margin') || '0px'})
            </label>
            <input
              type="range"
              min={0}
              max={48}
              step={4}
              value={parseNumericValue(getCurrentStyling('margin') || '0px')}
              onChange={(e) => updateElementStyling({ margin: formatNumericValue(Number(e.target.value)) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span>24px</span>
              <span>48px</span>
            </div>
          </div>

          {/* Gap between elements */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gap Between Elements ({getCurrentStyling('gap') || '16px'})
            </label>
            <input
              type="range"
              min={0}
              max={32}
              step={2}
              value={parseNumericValue(getCurrentStyling('gap') || '16px')}
              onChange={(e) => updateElementStyling({ gap: formatNumericValue(Number(e.target.value)) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span>16px</span>
              <span>32px</span>
            </div>
          </div>
        </div>

        {/* Border Section */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Square className="w-4 h-4 text-gray-600" />
            <h4 className="text-md font-medium text-gray-700">Border</h4>
          </div>
          
          {/* Border Radius */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border Radius ({getCurrentStyling('borderRadius') || '8px'})
            </label>
            <input
              type="range"
              min={0}
              max={24}
              step={2}
              value={parseNumericValue(getCurrentStyling('borderRadius') || '8px')}
              onChange={(e) => updateElementStyling({ borderRadius: formatNumericValue(Number(e.target.value)) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span>12px</span>
              <span>24px</span>
            </div>
          </div>

          {/* Border Width */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border Width ({getCurrentStyling('borderWidth') || '1px'})
            </label>
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={parseNumericValue(getCurrentStyling('borderWidth') || '1px')}
              onChange={(e) => updateElementStyling({ borderWidth: formatNumericValue(Number(e.target.value)) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span>4px</span>
              <span>8px</span>
            </div>
          </div>

          {/* Border Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={getCurrentStyling('borderColor') || selectedElement.styling?.borderColor || '#e5e7eb'}
                onChange={(e) => updateElementStyling({ borderColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={getCurrentStyling('borderColor') || selectedElement.styling?.borderColor || '#e5e7eb'}
                onChange={(e) => updateElementStyling({ borderColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#e5e7eb"
              />
            </div>
          </div>

          {/* Border Style */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border Style
            </label>
            <select
              value={getCurrentStyling('borderStyle') || selectedElement.styling?.borderStyle || 'solid'}
              onChange={(e) => updateElementStyling({ borderStyle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>
        </div>

        {/* Typography Section */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-gray-600" />
            <h4 className="text-md font-medium text-gray-700">Typography</h4>
          </div>
          
          {/* Font Size */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size ({getCurrentStyling('fontSize') || '16px'})
            </label>
            <input
              type="range"
              min={12}
              max={32}
              step={2}
              value={parseNumericValue(getCurrentStyling('fontSize') || '16px')}
              onChange={(e) => updateElementStyling({ fontSize: formatNumericValue(Number(e.target.value)) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12px</span>
              <span>22px</span>
              <span>32px</span>
            </div>
          </div>

          {/* Font Weight */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Weight
            </label>
            <select
              value={getCurrentStyling('fontWeight') || selectedElement.styling?.fontWeight || 'normal'}
              onChange={(e) => updateElementStyling({ fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal (400)</option>
              <option value="bold">Bold (700)</option>
              <option value="100">Thin (100)</option>
              <option value="200">Extra Light (200)</option>
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
              <option value="900">Black (900)</option>
            </select>
          </div>
        </div>

        {/* Advanced Section */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-gray-600" />
            <h4 className="text-md font-medium text-gray-700">Advanced</h4>
          </div>
          
          {/* Width */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width
            </label>
            <input
              type="text"
              value={getCurrentStyling('width') || selectedElement.styling?.width || 'auto'}
              onChange={(e) => updateElementStyling({ width: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="auto, 100%, 500px"
            />
          </div>

          {/* Height */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height
            </label>
            <input
              type="text"
              value={getCurrentStyling('height') || selectedElement.styling?.height || 'auto'}
              onChange={(e) => updateElementStyling({ height: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="auto, 100vh, 300px"
            />
          </div>

          {/* Custom CSS */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom CSS
            </label>
            <textarea
              value={getCurrentStyling('customCSS') || selectedElement.styling?.customCSS || ''}
              onChange={(e) => updateElementStyling({ customCSS: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter custom CSS properties"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Add any additional CSS properties (e.g., box-shadow, transform, etc.)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 