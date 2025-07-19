import React from 'react';
import { CheckoutConfiguration } from './types';
import {
  updateCheckoutConfig,
  updateTheme,
  updateLayout,
  updateProgressBar,
  updateAnimation
} from './utils/configUtils';

interface ConfigurationPanelProps {
  config: CheckoutConfiguration;
  onConfigChange: (config: CheckoutConfiguration) => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  config,
  onConfigChange
}) => {
  const updateConfig = (updates: Partial<CheckoutConfiguration>) => {
    onConfigChange({
      ...config,
      ...updates
    });
  };

  const updateCheckoutConfigLocal = (updates: Partial<CheckoutConfiguration['checkoutConfig']>) => {
    onConfigChange(updateCheckoutConfig(config, updates));
  };

  const updateThemeLocal = (updates: Partial<CheckoutConfiguration['checkoutConfig']['theme']>) => {
    onConfigChange(updateTheme(config, updates));
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Checkout Configuration</h3>
      
      <div className="space-y-4">
        {/* Layout Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Layout Type
          </label>
          <select
            value={config.checkoutConfig.layout.type}
            onChange={(e) => updateCheckoutConfigLocal({
              layout: {
                ...config.checkoutConfig.layout,
                type: e.target.value as 'one_column' | 'two_column'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="one_column">One Column</option>
            <option value="two_column">Two Column</option>
          </select>
        </div>

        {/* Step Mode */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.checkoutConfig.stepMode !== false}
              onChange={(e) => updateCheckoutConfig({
                stepMode: e.target.checked
              })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Enable Step Mode</span>
          </label>
        </div>

        {/* Enable Header */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.checkoutConfig.enableHeader !== false}
              onChange={(e) => updateCheckoutConfig({
                enableHeader: e.target.checked
              })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Show Header</span>
          </label>
        </div>

        {/* Color Customization */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">Color Customization</h4>
          
          {/* Primary Color */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={config.checkoutConfig.theme.primaryColor}
                onChange={(e) => updateThemeLocal({ primaryColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.checkoutConfig.theme.primaryColor}
                onChange={(e) => updateThemeLocal({ primaryColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#007bff"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={config.checkoutConfig.theme.secondaryColor}
                onChange={(e) => updateThemeLocal({ secondaryColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.checkoutConfig.theme.secondaryColor}
                onChange={(e) => updateThemeLocal({ secondaryColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#6c757d"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={config.checkoutConfig.theme.accentColor}
                onChange={(e) => updateThemeLocal({ accentColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.checkoutConfig.theme.accentColor}
                onChange={(e) => updateThemeLocal({ accentColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#28a745"
              />
            </div>
          </div>

          {/* Background Color */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={config.checkoutConfig.theme.backgroundColor}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.checkoutConfig.theme.backgroundColor}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={config.checkoutConfig.theme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.checkoutConfig.theme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#333333"
              />
            </div>
          </div>
        </div>

        {/* Progress Bar Type */}
        {config.checkoutConfig.stepMode !== false && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress Bar Type
            </label>
            <select
              value={config.checkoutConfig.progressBar.type}
              onChange={(e) => updateCheckoutConfig({
                progressBar: {
                  ...config.checkoutConfig.progressBar,
                  type: e.target.value as any
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="progress_bar">Progress Bar</option>
              <option value="step_indicators">Step Indicators</option>
              <option value="breadcrumb">Breadcrumb</option>
              <option value="dots">Dots</option>
              <option value="numbers">Numbers</option>
              <option value="timeline">Timeline</option>
            </select>
          </div>
        )}

        {/* One Column Order (if one column layout) */}
        {config.checkoutConfig.layout.type === 'one_column' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Order
            </label>
            <select
              value={config.checkoutConfig.layout.oneColumn?.order || 'customer_first'}
              onChange={(e) => updateCheckoutConfig({
                layout: {
                  ...config.checkoutConfig.layout,
                  oneColumn: {
                    backgroundColor: config.checkoutConfig.layout.oneColumn?.backgroundColor || '#ffffff',
                    borderColor: config.checkoutConfig.layout.oneColumn?.borderColor || '#e5e7eb',
                    borderStyle: config.checkoutConfig.layout.oneColumn?.borderStyle || 'solid',
                    borderWidth: config.checkoutConfig.layout.oneColumn?.borderWidth || 1,
                    borderRadius: config.checkoutConfig.layout.oneColumn?.borderRadius || 8,
                    order: e.target.value as 'customer_first' | 'product_first'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="customer_first">Customer Info First</option>
              <option value="product_first">Product Info First</option>
            </select>
          </div>
        )}

        {/* Two Column Layout (if two column layout) */}
        {config.checkoutConfig.layout.type === 'two_column' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Left Column Content
              </label>
              <select
                value={config.checkoutConfig.layout.twoColumn?.leftColumn.content || 'customer_info'}
                onChange={(e) => {
                  const leftContent = e.target.value as 'customer_info' | 'product_info';
                  const rightContent = leftContent === 'customer_info' ? 'product_info' : 'customer_info';
                  updateCheckoutConfig({
                    layout: {
                      ...config.checkoutConfig.layout,
                      twoColumn: {
                        ...config.checkoutConfig.layout.twoColumn,
                        gap: config.checkoutConfig.layout.twoColumn?.gap ?? 32,
                        leftColumn: {
                          content: leftContent,
                          width: config.checkoutConfig.layout.twoColumn?.leftColumn.width || '60%'
                        },
                        rightColumn: {
                          content: rightContent,
                          width: config.checkoutConfig.layout.twoColumn?.rightColumn?.width || '40%'
                        }
                      }
                    }
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="customer_info">Customer Info</option>
                <option value="product_info">Product Info</option>
              </select>
            </div>
            {/* Range slider for resizing left column width */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Left Column Width ({config.checkoutConfig.layout.twoColumn?.leftColumn.width || '60%'})
              </label>
              <input
                type="range"
                min={30}
                max={70}
                step={1}
                value={parseInt((config.checkoutConfig.layout.twoColumn?.leftColumn.width || '60%').replace('%', ''))}
                onChange={(e) => {
                  const leftWidth = `${e.target.value}%`;
                  const rightWidth = `${100 - Number(e.target.value)}%`;
                  const leftContent = config.checkoutConfig.layout.twoColumn?.leftColumn.content || 'customer_info';
                  const rightContent = leftContent === 'customer_info' ? 'product_info' : 'customer_info';
                  updateCheckoutConfig({
                    layout: {
                      ...config.checkoutConfig.layout,
                      twoColumn: {
                        ...config.checkoutConfig.layout.twoColumn,
                        gap: config.checkoutConfig.layout.twoColumn?.gap ?? 32,
                        leftColumn: {
                          ...config.checkoutConfig.layout.twoColumn?.leftColumn,
                          width: leftWidth,
                          content: leftContent
                        },
                        rightColumn: {
                          ...config.checkoutConfig.layout.twoColumn?.rightColumn,
                          width: rightWidth,
                          content: rightContent
                        }
                      }
                    }
                  });
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>30%</span>
                <span>70%</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 