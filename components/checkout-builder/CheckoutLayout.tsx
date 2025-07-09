import React from "react";
import { Theme, Addon } from "./types";
import { ProductSummary } from "./ProductSummary";
import { CouponField } from "./CouponField";
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

interface Layout {
  type: string;
  twoColumn?: {
    leftColumn: {
      content: string;
      width: string;
    };
    rightColumn: {
      content: string;
      width: string;
    };
    gap: number;
  };
  oneColumn?: {
    backgroundColor?: string;
    borderWidth?: number;
    borderStyle?: string;
    borderColor?: string;
    borderRadius?: number;
    order?: "customer_first" | "product_first";
  };
}

interface CheckoutLayoutProps {
  theme: Theme;
  children: React.ReactNode;
  products: Product[];
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
  layout: Layout;
  selectedAddons?: Addon[];
  isPreview?: boolean;
}

export const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({
  theme,
  children,
  products,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onUpdateQuantity,
  onRemoveProduct,
  layout,
  selectedAddons = [],
  isPreview = false,
}) => {
  const renderCustomerInfo = () => (
    <div className="customer-info-section">{children}</div>
  );

  const renderProductInfo = () => (
    <div className="product-info-section">
      <CouponField
        theme={theme}
        onApplyCoupon={onApplyCoupon}
        onRemoveCoupon={onRemoveCoupon}
        appliedCoupon={appliedCoupon}
        isPreview={isPreview}
      />
      <ProductSummary
        products={products}
        theme={theme}
        appliedCoupon={appliedCoupon}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveProduct={onRemoveProduct}
        selectedAddons={selectedAddons}
        isPreview={isPreview}
      />
    </div>
  );

  if (layout.type === "one_column") {
    const order = layout.oneColumn?.order || "customer_first";

    const customerSectionElement = {
      id: "customer-section",
      type: "section" as const,
      label: "Customer Information",
      subtitle: "Customer details and form fields",
      description: "Section containing customer information and checkout form",
      path: "checkoutConfig.layout.oneColumn.customerSection",
      styling: {
        backgroundColor: theme.backgroundColor,
        padding: theme.spacing.lg,
        borderRadius: theme.spacing.lg,
        border: `1px solid ${theme.borderColor}`,
      },
    };

    const productSectionElement = {
      id: "product-section",
      type: "section" as const,
      label: "Product Information",
      subtitle: "Order summary and product details",
      description: "Section containing product summary and order totals",
      path: "checkoutConfig.layout.oneColumn.productSection",
      styling: {
        backgroundColor: theme.backgroundColor,
        padding: theme.spacing.lg,
        borderRadius: theme.spacing.lg,
        border: `1px solid ${theme.borderColor}`,
      },
    };

    const customerSection = (
      <SelectableElement element={customerSectionElement} isPreview={isPreview}>
        <div
          className="customer-info-section"
          style={{
            marginBottom: theme.spacing.xl,
            paddingBottom: theme.spacing.xl,
            borderBottom: `1px solid ${theme.borderColor}`,
          }}
        >
          {children}
        </div>
      </SelectableElement>
    );

    const productSection = (
      <SelectableElement element={productSectionElement} isPreview={isPreview}>
        <div
          className="product-info-section"
          style={{
            paddingTop: theme.spacing.lg,
          }}
        >
          {renderProductInfo()}
        </div>
      </SelectableElement>
    );

    const containerElement = {
      id: "one-column-container",
      type: "layout" as const,
      label: "One Column Layout",
      subtitle: "Single column checkout layout",
      description: "Main container for one-column checkout layout",
      path: "checkoutConfig.layout.oneColumn",
      styling: {
        backgroundColor: layout.oneColumn?.backgroundColor || theme.backgroundColor,
        padding: theme.spacing.lg,
        borderRadius: `${layout.oneColumn?.borderRadius || 8}px`,
        border: `${layout.oneColumn?.borderWidth || 1}px ${
          layout.oneColumn?.borderStyle || "solid"
        } ${layout.oneColumn?.borderColor || theme.borderColor}`,
      },
    };

    return (
      <SelectableElement element={containerElement} isPreview={isPreview}>
        <div
          className="checkout-container"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: theme.spacing.lg,
            backgroundColor:
              layout.oneColumn?.backgroundColor || theme.backgroundColor,
            border: `${layout.oneColumn?.borderWidth || 1}px ${
              layout.oneColumn?.borderStyle || "solid"
            } ${layout.oneColumn?.borderColor || theme.borderColor}`,
            borderRadius: `${layout.oneColumn?.borderRadius || 8}px`,
            boxShadow:
              theme.colorScheme === "dark"
                ? "0 4px 6px rgba(0, 0, 0, 0.3)"
                : "0 4px 6px rgba(0, 0, 0, 0.1)",
            minHeight: "calc(100vh - 120px)", // Account for header
          }}
        >
          {order === "customer_first" ? (
            <>
              {customerSection}
              {productSection}
            </>
          ) : (
            <>
              {productSection}
              {customerSection}
            </>
          )}
        </div>
      </SelectableElement>
    );
  }

  // Two column layout
  const { twoColumn } = layout;
  if (!twoColumn) return null;

  const leftContent =
    twoColumn.leftColumn.content === "customer_info"
      ? renderCustomerInfo()
      : renderProductInfo();
  const rightContent =
    twoColumn.rightColumn.content === "customer_info"
      ? renderCustomerInfo()
      : renderProductInfo();

  const leftColumnElement = {
    id: "left-column",
    type: "layout" as const,
    label: "Left Column",
    subtitle: twoColumn.leftColumn.content === "customer_info" ? "Customer Info" : "Product Info",
    description: `Left column containing ${twoColumn.leftColumn.content === "customer_info" ? "customer information" : "product information"}`,
    path: "checkoutConfig.layout.twoColumn.leftColumn",
    styling: {
      backgroundColor: theme.backgroundColor,
      padding: theme.spacing.lg,
      borderRadius: theme.spacing.lg,
      border: `1px solid ${theme.borderColor}`,
    },
  };

  const rightColumnElement = {
    id: "right-column",
    type: "layout" as const,
    label: "Right Column",
    subtitle: twoColumn.rightColumn.content === "customer_info" ? "Customer Info" : "Product Info",
    description: `Right column containing ${twoColumn.rightColumn.content === "customer_info" ? "customer information" : "product information"}`,
    path: "checkoutConfig.layout.twoColumn.rightColumn",
    styling: {
      backgroundColor: theme.backgroundColor,
      padding: theme.spacing.lg,
      borderRadius: theme.spacing.lg,
      border: `1px solid ${theme.borderColor}`,
    },
  };

  return (
    <div
      className="checkout-container"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: theme.spacing.lg,
        display: "flex",
        gap: `${twoColumn.gap}px`,
        alignItems: "flex-start",
      }}
    >
      <SelectableElement element={leftColumnElement} isPreview={isPreview} style={{ width: twoColumn.leftColumn.width }}>
        {leftContent}
      </SelectableElement>
      <SelectableElement element={rightColumnElement} isPreview={isPreview} style={{ width: twoColumn.rightColumn.width }}>
        {rightContent}
      </SelectableElement>
    </div>
  );
};
