import React, { useState } from "react";
import {
  Trash2,
  Package,
  DollarSign,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Theme, Addon } from "./types";
import { SelectableElement } from "./SelectableElement";
import { getPrimaryColorAndSecondaryColor } from "./utils/configUtils";
import { useCheckoutBuilder } from "./contexts/CheckoutBuilderContext";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface Coupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
}

interface ProductSummaryProps {
  products: Product[];
  theme: Theme;
  appliedCoupon?: Coupon | null;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveProduct?: (productId: string) => void;
  selectedAddons?: Addon[];
  isPreview?: boolean;
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({
  products,
  theme,
  appliedCoupon,
  onUpdateQuantity,
  selectedAddons = [],
  isPreview = false,
}) => {
  const [selectedPriceModel, setSelectedPriceModel] =
    useState<string>("one-time");

    const {config} = useCheckoutBuilder()

  const priceModels = [
    {
      id: "one-time",
      name: "One-Time Payment",
      type: "one_time",
      description: "Pay once and own forever",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: "monthly",
      name: "Monthly Subscription",
      type: "subscription",
      description: "Pay monthly, cancel anytime",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "yearly",
      name: "Yearly Subscription",
      type: "subscription",
      description: "Pay yearly, save more",
      icon: <Calendar className="h-4 w-4" />,
    },
  ];
  const subtotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const addonsTotal = selectedAddons.reduce(
    (sum, addon) => sum + addon.price * (addon.quantity || 1),
    0
  );
  const shipping = 5.99;

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discount = (subtotal + addonsTotal) * (appliedCoupon.discount / 100);
    } else {
      discount = appliedCoupon.discount;
    }
  }

  const tax = (subtotal + addonsTotal - discount) * 0.08;

  // Calculate total based on selected price model
  const selectedModel = priceModels.find(
    (model) => model.id === selectedPriceModel
  );
  let total = subtotal + addonsTotal + shipping + tax - discount;

  // Adjust total based on pricing model
  if (selectedModel?.type === "subscription") {
    // For subscription models, show monthly/yearly total
    if (selectedModel.id === "yearly") {
      // Yearly subscription - show yearly total
      total = (subtotal + addonsTotal) * 12 + shipping + tax - discount;
    } else {
      // Monthly subscription - show monthly total
      total = subtotal + addonsTotal + shipping + tax - discount;
    }
  }

  const productSummaryElement = {
    id: "product-summary",
    type: "product-summary" as const,
    label: "Order Summary",
    description: "Review your items and total",
    path: "checkoutConfig.productSummary",
    styling: {
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      padding: theme.spacing.lg,
      margin: `0 0 ${theme.spacing.lg} 0`,
      borderRadius: theme.borderRadius,
      border: `1px solid ${theme.borderColor}`,
      fontSize: "18px",
      fontWeight: "600",
    },
  };

  const labelColor = getPrimaryColorAndSecondaryColor(config.checkoutConfig);
  return (
    <div className="product-summary" style={{ marginBottom: theme.spacing.lg }}>
      <SelectableElement element={productSummaryElement} isPreview={isPreview}>
        <h3
          style={{
            color: labelColor.primaryColor,
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: theme.spacing.md,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <Package size={20} />
          {productSummaryElement.label}
        </h3>
        <div
          className="products-list"
          style={{ marginBottom: theme.spacing.lg }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-item"
              style={{
                display: "flex",
                gap: theme.spacing.md,
                padding: theme.spacing.md,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: theme.borderRadius,
                marginBottom: theme.spacing.sm,
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? "#2a2a2a"
                    : theme.backgroundColor,
              }}
            >
              <div
                className="product-image"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: theme.borderRadius,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="product-details" style={{ flex: 1 }}>
                <h4
                  style={{
                    color: theme.textColor,
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                >
                  {product.name}
                </h4>
                {product.variant && (
                  <p
                    style={{
                      color: theme.secondaryColor,
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  >
                    {product.variant}
                  </p>
                )}
                <p
                  style={{
                    color: theme.secondaryColor,
                    fontSize: "12px",
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {product.description}
                </p>
                <div
                  className="product-actions"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    className="quantity-controls"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                    }}
                  >
                    <button
                      onClick={() =>
                        onUpdateQuantity?.(
                          product.id,
                          Math.max(1, product.quantity - 1)
                        )
                      }
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "4px",
                        border: `1px solid ${theme.borderColor}`,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                      }}
                    >
                      -
                    </button>
                    <span
                      style={{
                        fontSize: "14px",
                        color: theme.textColor,
                        minWidth: "20px",
                        textAlign: "center",
                      }}
                    >
                      {product.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity?.(product.id, product.quantity + 1)
                      }
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "4px",
                        border: `1px solid ${theme.borderColor}`,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div
                    className="product-price"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                    }}
                  >
                    <span
                      style={{
                        color: theme.primaryColor,
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SelectableElement>
      {/* Price Model Selector */}
      {products.length > 0 && (
        <SelectableElement
          element={{
            id: "price-model-section",
            type: "section" as const,
            label: "Price Model Section",
            path: `checkoutConfig.productSummary.priceModelSection`,
            styling: {
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              borderRadius: theme.borderRadius,
              border: `1px solid ${theme.borderColor}`,
              fontSize: "14px",
              fontWeight: "400",
            },
          }}
          isPreview={isPreview}
        >
          <div
            className="price-model-section"
            style={{ marginBottom: theme.spacing.lg }}
          >
            <h4
              style={{
                color: labelColor.primaryColor,
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: theme.spacing.sm,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              <DollarSign size={16} />
              Pricing Model
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.sm,
              }}
            >
              {priceModels.map((model, index) => (
                <label
                  key={model.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.sm,
                    padding: theme.spacing.sm,
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: theme.borderRadius,
                    backgroundColor:
                      selectedPriceModel === model.id
                        ? theme.primaryColor + "20"
                        : theme.backgroundColor,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    width: "100%",
                  }}
                >
                  <input
                    type="radio"
                    name="priceModel"
                    value={model.id}
                    checked={selectedPriceModel === model.id}
                    onChange={(e) => setSelectedPriceModel(e.target.value)}
                    style={{
                      accentColor: theme.primaryColor,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        padding: "4px",
                        backgroundColor: theme.primaryColor + "20",
                        borderRadius: "4px",
                        color: theme.primaryColor,
                      }}
                    >
                      {model.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          color: theme.textColor,
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {model.name}
                      </div>
                      <div
                        style={{
                          color: theme.secondaryColor,
                          fontSize: "12px",
                        }}
                      >
                        {model.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </SelectableElement>
      )}

      {/* Addons Summary */}
      {selectedAddons.length > 0 && (
        <div
          className="addons-summary"
          style={{ marginBottom: theme.spacing.lg }}
        >
          <h4
            style={{
              color: labelColor.primaryColor,
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: theme.spacing.sm,
            }}
          >
            Add-ons
          </h4>
          {selectedAddons.map((addon) => (
            <SelectableElement
              key={`addon-${addon.id}`}
              element={{
                id: `addon-${addon.id}`,
                type: "section" as const,
                label: addon.name,
                path: `checkoutConfig.productSummary.addons.${addon.id}`,
                styling: {
                  backgroundColor: theme.backgroundColor,
                  color: theme.textColor,
                  borderRadius: theme.borderRadius,
                  border: `1px solid ${theme.borderColor}`,
                  fontSize: "14px",
                  fontWeight: "400",
                },
              }}
              isPreview={isPreview}
            >
              <div
                className="addon-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.borderColor}`,
                  borderRadius: theme.borderRadius,
                  marginBottom: theme.spacing.xs,
                  backgroundColor: theme.backgroundColor,
                }}
              >
                <span
                  style={{
                    color: theme.textColor,
                    fontSize: "14px",
                  }}
                >
                  {addon.name}{" "}
                  {addon.quantity &&
                    addon.quantity > 1 &&
                    `(x${addon.quantity})`}
                </span>
                <span
                  style={{
                    color: theme.primaryColor,
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  ${(addon.price * (addon.quantity || 1)).toFixed(2)}
                </span>
              </div>
            </SelectableElement>
          ))}
        </div>
      )}

      {/* Order Totals */}
      <SelectableElement
        element={{
          id: `order-totals`,
          type: "order-totals" as const,
          label: "Order Totals",
          path: `checkoutConfig.orderTotals`,
          styling: {
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
            padding: "0",
            margin: "0",
            borderRadius: "4px",
            border: `1px solid ${theme.borderColor}`,
            fontSize: "12px",
            fontWeight: "normal",
            width: "24px",
            height: "24px",
          },
        }}
        isPreview={isPreview}
      >
        <div className="order-totals">
          <div
            className="total-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: theme.spacing.sm,
              borderBottom: `1px solid ${theme.borderColor}`,
            }}
          >
            <span style={{ color: labelColor.secondaryColor }}>Subtotal</span>
            <span style={{ color: labelColor.secondaryColor }}>
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {addonsTotal > 0 && (
            <div
              className="total-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: theme.spacing.sm,
                borderBottom: `1px solid ${theme.borderColor}`,
              }}
            >
              <span style={{ color: theme.secondaryColor }}>Add-ons</span>
              <span style={{ color: theme.textColor }}>
                ${addonsTotal.toFixed(2)}
              </span>
            </div>
          )}

          <div
            className="total-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: theme.spacing.sm,
              borderBottom: `1px solid ${theme.borderColor}`,
            }}
          >
            <span style={{ color: labelColor.secondaryColor }}>Shipping</span>
            <span style={{ color: labelColor.secondaryColor }}>
              ${shipping.toFixed(2)}
            </span>
          </div>

          <div
            className="total-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: theme.spacing.sm,
              borderBottom: `1px solid ${theme.borderColor}`,
            }}
          >
            <span style={{ color: labelColor.secondaryColor }}>Tax</span>
            <span style={{ color: labelColor.secondaryColor }}>${tax.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div
              className="total-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: theme.spacing.sm,
                borderBottom: `1px solid ${theme.borderColor}`,
              }}
            >
              <span style={{ color: theme.successColor }}>Discount</span>
              <span style={{ color: theme.successColor }}>
                -${discount.toFixed(2)}
              </span>
            </div>
          )}

          {/* Pricing Model Info */}
          {selectedModel && (
            <div
              className="total-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: theme.spacing.sm,
                borderBottom: `1px solid ${theme.borderColor}`,
                backgroundColor: theme.primaryColor + "10",
              }}
            >
              <span style={{ color: labelColor.primaryColor, fontSize: "12px" }}>
                Pricing Model
              </span>
              <span
                style={{
                  color: labelColor.primaryColor,
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {selectedModel ? selectedModel.name : ""}
              </span>
            </div>
          )}

          <div
            className="total-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: theme.spacing.md,
              fontSize: "18px",
              fontWeight: "700",
              color: labelColor.primaryColor,
              borderTop: `2px solid ${theme.borderColor}`,
            }}
          >
            <span>
              {selectedModel && selectedModel.type === "subscription"
                ? selectedModel.id === "yearly"
                  ? "Yearly Total"
                  : "Monthly Total"
                : "Total"}
            </span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </SelectableElement>
    </div>
  );
};
