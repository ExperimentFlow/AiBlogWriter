import React from 'react';
import { CheckoutConfiguration } from './types';
import { CheckoutCore } from './CheckoutCore';
import { useElementSelection } from './contexts/ElementSelectionContext';

interface LivePreviewLayoutProps {
  config: CheckoutConfiguration;
  onConfigChange?: (config: CheckoutConfiguration) => void;
}

export const LivePreviewLayout: React.FC<LivePreviewLayoutProps> = ({ 
  config, 
  onConfigChange 
}) => {
  const { setSelectedElement } = useElementSelection();

  const handleBackgroundClick = () => {
    setSelectedElement(null);
  };

  return (
    <div 
      className="live-preview-container"
      onClick={handleBackgroundClick}
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        padding: '20px',
        cursor: 'default'
      }}
    >
      <div className="preview-header mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Live Preview</h2>
        <p className="text-sm text-gray-600">Click on any element to customize its styling</p>
      </div>
      
      <div className="preview-content">
        <CheckoutCore 
          config={config} 
          isPreview={true}
          onConfigChange={onConfigChange}
        />
      </div>
    </div>
  );
}; 