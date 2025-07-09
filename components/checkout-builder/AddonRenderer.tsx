import React from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { Addon, Theme } from './types';
import { SelectableElement } from './SelectableElement';

interface AddonRendererProps {
  addons: Addon[];
  displayType: 'grid' | 'list' | 'cards';
  maxSelections?: number;
  theme: Theme;
  selectedAddons: Addon[];
  onAddonToggle: (addon: Addon) => void;
  onAddonQuantityChange: (addonId: string, quantity: number) => void;
  isPreview?: boolean;
}

export const AddonRenderer: React.FC<AddonRendererProps> = ({
  addons,
  displayType,
  maxSelections,
  theme,
  selectedAddons,
  onAddonToggle,
  onAddonQuantityChange,
  isPreview = false
}) => {
  const isAddonSelected = (addonId: string) => {
    return selectedAddons.some(addon => addon.id === addonId);
  };

  const getSelectedAddon = (addonId: string) => {
    return selectedAddons.find(addon => addon.id === addonId);
  };

  const canSelectMore = () => {
    if (!maxSelections) return true;
    return selectedAddons.length < maxSelections;
  };

  const handleAddonToggle = (addon: Addon) => {
    if (!isAddonSelected(addon.id) && !canSelectMore()) {
      return; // Cannot select more
    }
    onAddonToggle(addon);
  };

  const renderAddonCard = (addon: Addon) => {
    const isSelected = isAddonSelected(addon.id);
    const selectedAddon = getSelectedAddon(addon.id);
    const quantity = selectedAddon?.quantity || 1;

    const addonCardElement = {
      id: `addon-card-${addon.id}`,
      type: 'field' as const,
      label: `Addon: ${addon.name}`,
      path: `steps[].sections[].addons[${addon.id}]`,
      styling: {
        backgroundColor: isSelected ? theme.primaryColor + '10' : theme.backgroundColor,
        color: theme.textColor,
        padding: theme.spacing.lg,
        margin: '0',
        borderRadius: theme.borderRadius,
        border: `2px solid ${isSelected ? theme.primaryColor : theme.borderColor}`,
        fontSize: '16px',
        fontWeight: '600',
        width: '100%',
        height: 'auto',
      }
    };

    return (
      <SelectableElement key={addon.id} element={addonCardElement} isPreview={isPreview}>
        <div
          className={`addon-card ${isSelected ? 'selected' : ''}`}
          style={{
            border: `2px solid ${isSelected ? theme.primaryColor : theme.borderColor}`,
            borderRadius: theme.borderRadius,
            padding: theme.spacing.lg,
            backgroundColor: isSelected ? theme.primaryColor + '10' : theme.backgroundColor,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={() => handleAddonToggle(addon)}
        >
          {isSelected && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '24px',
                height: '24px',
                backgroundColor: theme.primaryColor,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={16} color="#ffffff" />
            </div>
          )}

          {addon.image && (
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: theme.borderRadius,
                overflow: 'hidden',
                marginBottom: theme.spacing.sm,
              }}
            >
              <img
                src={addon.image}
                alt={addon.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          <h4
            style={{
              color: theme.textColor,
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: theme.spacing.xs,
            }}
          >
            {addon.name}
          </h4>

          <p
            style={{
              color: theme.secondaryColor,
              fontSize: '14px',
              marginBottom: theme.spacing.sm,
              lineHeight: '1.4',
            }}
          >
            {addon.description}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                color: theme.primaryColor,
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              ${addon.price.toFixed(2)}
            </span>

            {isSelected && addon.maxQuantity && addon.maxQuantity > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <SelectableElement 
                  element={{
                    id: `addon-${addon.id}-minus-button`,
                    type: 'button' as const,
                    label: 'Decrease Quantity Button',
                    path: `steps[].sections[].addons[${addon.id}].quantityControls.minus`,
                    styling: {
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor,
                      padding: '0',
                      margin: '0',
                      borderRadius: '4px',
                      border: `1px solid ${theme.borderColor}`,
                      fontSize: '12px',
                      fontWeight: 'normal',
                      width: '24px',
                      height: '24px',
                    }
                  }} 
                  isPreview={isPreview}
                >
                  <button
                    onClick={() => onAddonQuantityChange(addon.id, Math.max(1, quantity - 1))}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: `1px solid ${theme.borderColor}`,
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Minus size={12} />
                  </button>
                </SelectableElement>
                <span
                  style={{
                    fontSize: '14px',
                    color: theme.textColor,
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {quantity}
                </span>
                <SelectableElement 
                  element={{
                    id: `addon-${addon.id}-plus-button`,
                    type: 'button' as const,
                    label: 'Increase Quantity Button',
                    path: `steps[].sections[].addons[${addon.id}].quantityControls.plus`,
                    styling: {
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor,
                      padding: '0',
                      margin: '0',
                      borderRadius: '4px',
                      border: `1px solid ${theme.borderColor}`,
                      fontSize: '12px',
                      fontWeight: 'normal',
                      width: '24px',
                      height: '24px',
                    }
                  }} 
                  isPreview={isPreview}
                >
                  <button
                    onClick={() => onAddonQuantityChange(addon.id, Math.min(addon.maxQuantity || 10, quantity + 1))}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: `1px solid ${theme.borderColor}`,
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={12} />
                  </button>
                </SelectableElement>
              </div>
            )}
          </div>
        </div>
      </SelectableElement>
    );
  };

  const renderAddonList = (addon: Addon) => {
    const isSelected = isAddonSelected(addon.id);

    const addonListItemElement = {
      id: `addon-list-${addon.id}`,
      type: 'field' as const,
      label: `Addon: ${addon.name}`,
      path: `steps[].sections[].addons[${addon.id}]`,
      styling: {
        backgroundColor: isSelected ? theme.primaryColor + '10' : theme.backgroundColor,
        color: theme.textColor,
        padding: theme.spacing.md,
        margin: '0 0 8px 0',
        borderRadius: theme.borderRadius,
        border: `1px solid ${isSelected ? theme.primaryColor : theme.borderColor}`,
        fontSize: '16px',
        fontWeight: '600',
        width: '100%',
        height: 'auto',
      }
    };

    return (
      <SelectableElement key={addon.id} element={addonListItemElement}>
        <div
          className={`addon-list-item ${isSelected ? 'selected' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing.md,
            border: `1px solid ${isSelected ? theme.primaryColor : theme.borderColor}`,
            borderRadius: theme.borderRadius,
            backgroundColor: isSelected ? theme.primaryColor + '10' : theme.backgroundColor,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: theme.spacing.sm,
          }}
          onClick={() => handleAddonToggle(addon)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: `2px solid ${isSelected ? theme.primaryColor : theme.borderColor}`,
                backgroundColor: isSelected ? theme.primaryColor : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isSelected && <Check size={12} color="#ffffff" />}
            </div>
            <div>
              <h4
                style={{
                  color: theme.textColor,
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                {addon.name}
              </h4>
              <p
                style={{
                  color: theme.secondaryColor,
                  fontSize: '14px',
                }}
              >
                {addon.description}
              </p>
            </div>
          </div>
          <span
            style={{
              color: theme.primaryColor,
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            ${addon.price.toFixed(2)}
          </span>
        </div>
      </SelectableElement>
    );
  };

  if (displayType === 'grid') {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: theme.spacing.md,
        }}
      >
        {addons.map(renderAddonCard)}
      </div>
    );
  }

  if (displayType === 'list') {
    return (
      <div>
        {addons.map(renderAddonList)}
      </div>
    );
  }

  // Default to cards
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: theme.spacing.md,
      }}
    >
      {addons.map(renderAddonCard)}
    </div>
  );
}; 