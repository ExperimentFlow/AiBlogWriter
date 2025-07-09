import React from 'react';
import { CheckoutConfig } from './types';
import { SelectableElement } from './SelectableElement';

interface CheckoutHeaderProps {
  config: CheckoutConfig;
  isPreview?: boolean;
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ config, isPreview = false }) => {
  const headerElement = {
    id: 'checkout-header',
    type: 'header' as const,
    label: config.name,
    subtitle: 'Complete your purchase securely',
    path: 'checkoutConfig',
    styling: {
      backgroundColor: config.theme.backgroundColor,
      color: config.theme.textColor,
      padding: config.theme.spacing.xl,
      margin: '0 0 24px 0',
      borderRadius: '0px',
      border: 'none',
      fontSize: '28px',
      fontWeight: '700',
    }
  };

  return (
    <SelectableElement element={headerElement} isPreview={isPreview}>
      <div
        className="checkout-header"
        style={{ 
          textAlign: "center", 
          marginBottom: config.theme.spacing.xl 
        }}
      >
        <h1
          style={{
            color: config.theme.textColor,
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: config.theme.spacing.sm,
          }}
        >
          {headerElement.label}
        </h1>
        <p
          style={{
            color: config.theme.secondaryColor,
            fontSize: "16px",
            marginBottom: config.theme.spacing.lg,
          }}
        >
          {headerElement.subtitle}
        </p>
      </div>
    </SelectableElement>
  );
}; 