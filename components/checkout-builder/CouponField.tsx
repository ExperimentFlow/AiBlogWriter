import React, { useState } from "react";
import { Tag, Check, X, AlertCircle } from "lucide-react";
import { Theme } from "./types";
import { SelectableElement } from "./SelectableElement";
import { useCheckoutBuilder } from "./contexts/CheckoutBuilderContext";
import { getPrimaryColorAndSecondaryColor } from "./utils/configUtils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { ProductSummary } from "./ProductSummary";

interface Coupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
}

interface CouponFieldProps {
  theme: Theme;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  appliedCoupon?: Coupon | null;
  isPreview?: boolean;
}

export const CouponField: React.FC<CouponFieldProps> = ({
  theme,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  isPreview = false,
}) => {
  const { config, selectedProducts, selectedAddons } = useCheckoutBuilder();
  const couponStyling = config.checkoutConfig.couponField?.styling;
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock available coupons
  const availableCoupons: Coupon[] = [
    {
      code: "SAVE10",
      discount: 10,
      type: "percentage",
      description: "Save 10% on your order",
    },
    {
      code: "FREESHIP",
      discount: 5.99,
      type: "fixed",
      description: "Free shipping",
    },
    {
      code: "WELCOME20",
      discount: 20,
      type: "percentage",
      description: "Welcome discount 20%",
    },
  ];

  const handleApplyCoupon = async () => {
    if (isPreview) {
      return;
    }

    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (coupon) {
      onApplyCoupon(coupon);
      setCouponCode("");
    } else {
      setError("Invalid coupon code");
    }

    setIsLoading(false);
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setError(null);
  };

  const couponFieldElement = {
    id: "coupon-field",
    type: "coupon-field" as const,
    label: "Coupon Field",
    path: "checkoutConfig.couponField",
    styling: {
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      padding: "8px 12px",
      margin: "0",
      borderRadius: theme.borderRadius,
      border: `1px solid ${error ? theme.errorColor : theme.borderColor}`,
      fontSize: "14px",
      fontWeight: "normal",
      width: "100%",
      height: "40px",
    },
  };

  const labelColor = getPrimaryColorAndSecondaryColor(config.checkoutConfig);

  return (
    <div className="coupon-field" style={{ marginBottom: theme.spacing.lg }}>
      {isPreview ? (
        <SelectableElement element={couponFieldElement} isPreview={isPreview}>
          <h3
            style={{
              color: couponStyling?.title?.color || labelColor.primaryColor,
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: theme.spacing.sm,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <Tag size={18} />
            {couponStyling?.title?.text || "Discount Code"}
          </h3>
          <div
            className="coupon-input-wrapper"
            style={{
              display: "flex",
              gap: theme.spacing.sm,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={couponStyling?.input?.placeholder || "Enter coupon code"}
              style={{
                flex: 1,
                height: "40px",
                padding: "8px 12px",
                borderRadius: theme.borderRadius,
                border: `1px solid ${
                  error ? theme.errorColor : couponStyling?.input?.borderColor || theme.borderColor
                }`,
                fontSize: "14px",
                backgroundColor:
                  couponStyling?.input?.backgroundColor || (theme.colorScheme === "dark"
                    ? "#2a2a2a"
                    : theme.backgroundColor),
                color: theme.textColor,
                outline: "none",
              }}
              onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isLoading || (!couponCode.trim() && !isPreview)}
              style={{
                height: "40px",
                padding: "8px 16px",
                borderRadius: theme.borderRadius,
                border: "none",
                backgroundColor:
                  isLoading || !couponCode.trim()
                    ? theme.borderColor
                    : couponStyling?.button?.backgroundColor || theme.primaryColor,
                color: couponStyling?.button?.textColor || "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                cursor:
                  isLoading || !couponCode.trim() ? "not-allowed" : "pointer",
                opacity: isLoading || !couponCode.trim() ? 0.6 : 1,
              }}
            >
              {isLoading ? "Applying..." : couponStyling?.button?.text || "Apply"}
            </button>
          </div>
          <div
            className="available-coupons"
            style={{
              fontSize: "12px",
              color: labelColor.secondaryColor,
              marginTop: theme.spacing.xs,
            }}
          >
            Available codes: {availableCoupons.map((c) => c.code).join(", ")}
          </div>
        </SelectableElement>
      ) : (
        <>
          <h3
            style={{
              color: couponStyling?.title?.color || labelColor.primaryColor,
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: theme.spacing.sm,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <Tag size={18} />
            {couponStyling?.title?.text || "Discount Code"}
          </h3>
          {appliedCoupon ? (
            <div
              className="applied-coupon"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: theme.spacing.md,
                backgroundColor: theme.successColor + "20",
                border: `1px solid ${theme.successColor}`,
                borderRadius: theme.borderRadius,
                marginBottom: theme.spacing.sm,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
              >
                <Check size={16} color={theme.successColor} />
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: theme.successColor,
                    }}
                  >
                    {appliedCoupon.code} - {appliedCoupon.description}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: theme.secondaryColor,
                    }}
                  >
                    {appliedCoupon.type === "percentage"
                      ? `${appliedCoupon.discount}% off`
                      : `${appliedCoupon.discount.toFixed(2)} off`}
                  </div>
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                style={{
                  background: "none",
                  border: "none",
                  color: theme.errorColor,
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                }}
                title="Remove coupon"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              className="coupon-input"
              style={{
                display: "flex",
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.sm,
              }}
            >
              <div
                className="coupon-input-wrapper"
                style={{
                  display: "flex",
                  gap: theme.spacing.sm,
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={couponStyling?.input?.placeholder || "Enter coupon code"}
                  style={{
                    flex: 1,
                    height: "40px",
                    padding: "8px 12px",
                    borderRadius: theme.borderRadius,
                    border: `1px solid ${
                      error ? theme.errorColor : couponStyling?.input?.borderColor || theme.borderColor
                    }`,
                    fontSize: "14px",
                    backgroundColor:
                      couponStyling?.input?.backgroundColor || (theme.colorScheme === "dark"
                        ? "#2a2a2a"
                        : theme.backgroundColor),
                    color: theme.textColor,
                    outline: "none",
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      style={{
                        height: "40px",
                        padding: "8px 16px",
                        borderRadius: theme.borderRadius,
                        border: "none",
                        backgroundColor: theme.primaryColor,
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Show Summary
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Order Summary</DialogTitle>
                      <DialogDescription>
                        Review your order details below.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <button
                  onClick={handleApplyCoupon}
                  disabled={isLoading || !couponCode.trim()}
                  style={{
                    height: "40px",
                    padding: "8px 16px",
                    borderRadius: theme.borderRadius,
                    border: "none",
                    backgroundColor:
                      isLoading || !couponCode.trim()
                        ? theme.borderColor
                        : couponStyling?.button?.backgroundColor || theme.primaryColor,
                    color: couponStyling?.button?.textColor || "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor:
                      isLoading || !couponCode.trim()
                        ? "not-allowed"
                        : "pointer",
                    opacity: isLoading || !couponCode.trim() ? 0.6 : 1,
                  }}
                >
                  {isLoading ? "Applying..." : couponStyling?.button?.text || "Apply"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div
              className="coupon-error"
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.xs,
                color: theme.errorColor,
                fontSize: "12px",
              }}
            >
              <AlertCircle size={12} />
              {error}
            </div>
          )}

          <div
            className="available-coupons"
            style={{
              fontSize: "12px",
              color: labelColor.secondaryColor,
              marginTop: theme.spacing.xs,
            }}
          >
            Available codes: {availableCoupons.map((c) => c.code).join(", ")}
          </div>
        </>
      )}
    </div>
  );
};
