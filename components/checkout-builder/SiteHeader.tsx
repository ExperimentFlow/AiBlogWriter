import React from 'react';
import { ArrowLeft, ShoppingCart, User, HelpCircle } from 'lucide-react';
import { Theme } from './types';
import { SelectableElement } from './SelectableElement';

interface SiteHeaderProps {
  theme: Theme;
  logo?: string;
  siteName?: string;
  onBackToShop?: () => void;
  cartItemCount?: number;
  isPreview?: boolean;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ 
  theme, 
  logo, 
  siteName = "Your Store", 
  onBackToShop,
  cartItemCount = 0,
  isPreview = false
}) => {
  return (
    <header
      className="site-header"
      style={{
        backgroundColor: theme.backgroundColor,
        borderBottom: `1px solid ${theme.borderColor}`,
        padding: `${theme.spacing.md} 0`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="header-container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: `0 ${theme.spacing.lg}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side - Logo and back button */}
        <div
          className="header-left"
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.md,
          }}
        >
          {onBackToShop && (
            <SelectableElement 
              element={{
                id: 'back-to-shop-button',
                type: 'button' as const,
                label: 'Back to Shop Button',
                path: 'checkoutConfig.header.backButton',
                styling: {
                  backgroundColor: 'transparent',
                  color: theme.primaryColor,
                  padding: '0',
                  margin: '0',
                  borderRadius: '0',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  width: 'auto',
                  height: 'auto',
                }
              }} 
              isPreview={isPreview}
            >
              <button
                onClick={onBackToShop}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.xs,
                  background: "none",
                  border: "none",
                  color: theme.primaryColor,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <ArrowLeft size={16} />
                Back to Shop
              </button>
            </SelectableElement>
          )}
          
          <div
            className="logo-section"
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            {logo ? (
              <img
                src={logo}
                alt={siteName}
                style={{
                  height: "32px",
                  width: "auto",
                }}
              />
            ) : (
              <div
                className="logo-placeholder"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: theme.primaryColor,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {siteName.charAt(0)}
              </div>
            )}
            <span
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: theme.textColor,
              }}
            >
              {siteName}
            </span>
          </div>
        </div>

        {/* Center - Checkout progress indicator */}
        <div
          className="header-center"
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.md,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: theme.secondaryColor,
              fontWeight: "500",
            }}
          >
            Secure Checkout
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
              fontSize: "12px",
              color: theme.successColor,
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: theme.successColor,
                borderRadius: "50%",
                animation: "pulse 2s infinite",
              }}
            />
            Secure Connection
          </div>
        </div>

        {/* Right side - Cart and help */}
        <div
          className="header-right"
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.md,
          }}
        >
          <SelectableElement 
            element={{
              id: 'help-button',
              type: 'button' as const,
              label: 'Help Button',
              path: 'checkoutConfig.header.helpButton',
              styling: {
                backgroundColor: 'transparent',
                color: theme.secondaryColor,
                padding: theme.spacing.sm,
                margin: '0',
                borderRadius: theme.borderRadius,
                border: 'none',
                fontSize: '14px',
                fontWeight: 'normal',
                width: 'auto',
                height: 'auto',
              }
            }} 
            isPreview={isPreview}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.xs,
                background: "none",
                border: "none",
                color: theme.secondaryColor,
                cursor: "pointer",
                fontSize: "14px",
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius,
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.borderColor + '20';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <HelpCircle size={16} />
              Help
            </button>
          </SelectableElement>
          
          <div
            className="cart-indicator"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius,
              backgroundColor: theme.primaryColor + '10',
              border: `1px solid ${theme.primaryColor + '30'}`,
            }}
          >
            <ShoppingCart size={16} color={theme.primaryColor} />
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: theme.primaryColor,
              }}
            >
              {cartItemCount} items
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </header>
  );
}; 