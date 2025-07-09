import React from "react";
import { Trash2, Package } from "lucide-react";
import { Theme, Addon } from "./types";
import { SelectableElement } from "./SelectableElement";

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
  onRemoveProduct,
  selectedAddons = [],
  isPreview = false,
}) => {
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
  const total = subtotal + addonsTotal + shipping + tax - discount;

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

  return (
   
      <div
        className="product-summary"
        style={{ marginBottom: theme.spacing.lg }}
      >
         <SelectableElement element={productSummaryElement} isPreview={isPreview}>
        <div>
          <h3
            style={{
              color: theme.textColor,
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
              <SelectableElement
                element={{
                  id: `product-${product.id}-product-item`,
                  type: "button" as const,
                  label: "Product Item",
                  path: `checkoutConfig.productSummary.products[${product.id}].productItem`,
                  styling: {
                    backgroundColor: "transparent",
                    color: theme.errorColor,
                    padding: "0",
                    margin: "0",
                    borderRadius: "4px",
                    border: `1px solid ${theme.errorColor}`,
                    fontSize: "12px",
                    fontWeight: "normal",
                    width: "24px",
                    height: "24px",
                  },
                }}
                isPreview={isPreview}
              >
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
                        <SelectableElement
                          element={{
                            id: `product-${product.id}-minus-button`,
                            type: "button" as const,
                            label: "Decrease Product Quantity",
                            path: `checkoutConfig.productSummary.products[${product.id}].quantityControls.minus`,
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
                        </SelectableElement>
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
                        <SelectableElement
                          element={{
                            id: `product-${product.id}-plus-button`,
                            type: "button" as const,
                            label: "Increase Product Quantity",
                            path: `checkoutConfig.productSummary.products[${product.id}].quantityControls.plus`,
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
                          <button
                            onClick={() =>
                              onUpdateQuantity?.(
                                product.id,
                                product.quantity + 1
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
                            +
                          </button>
                        </SelectableElement>
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
                </div>{" "}
              </SelectableElement>
            ))}
          </div>

          {/* Addons Summary */}
          {selectedAddons.length > 0 && (
            <div
              className="addons-summary"
              style={{ marginBottom: theme.spacing.lg }}
            >
              <h4
                style={{
                  color: theme.textColor,
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: theme.spacing.sm,
                }}
              >
                Add-ons
              </h4>
              {selectedAddons.map((addon) => (
                <div
                  key={addon.id}
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
              ))}
            </div>
          )}
        </div> </SelectableElement>

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
              <span style={{ color: theme.secondaryColor }}>Subtotal</span>
              <span style={{ color: theme.textColor }}>
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
              <span style={{ color: theme.secondaryColor }}>Shipping</span>
              <span style={{ color: theme.textColor }}>
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
              <span style={{ color: theme.secondaryColor }}>Tax</span>
              <span style={{ color: theme.textColor }}>${tax.toFixed(2)}</span>
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

            <div
              className="total-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: theme.spacing.md,
                fontSize: "18px",
                fontWeight: "700",
                color: theme.textColor,
                borderTop: `2px solid ${theme.borderColor}`,
              }}
            >
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </SelectableElement>
      </div>
   
  );
};
