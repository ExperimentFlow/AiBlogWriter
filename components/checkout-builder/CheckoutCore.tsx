import React from "react";
import { Loader2 } from "lucide-react";
import { CheckoutConfiguration } from "./types";
import { CheckoutHeader } from "./CheckoutHeader";
import { ProgressRenderer } from "./progress/ProgressRenderer";
import { SectionRenderer } from "./SectionRenderer";
import { StepActions } from "./StepActions";
import { SiteHeader } from "./SiteHeader";
import { CheckoutLayout } from "./CheckoutLayout";
import { useRouter } from "next/navigation";
import { SelectableElement } from "./SelectableElement";
import { useCheckoutBuilder } from "./contexts/CheckoutBuilderContext";
import { useElementSelection } from "./contexts/ElementSelectionContext";
import { getNestedValue } from "./utils/configUtils";

interface CheckoutCoreProps {
  config?: CheckoutConfiguration;
  products?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
  }>;
  isPreview?: boolean;
  onOrderSubmit?: (orderData: any) => void;
  onBackToShop?: () => void;
  onConfigChange?: (config: CheckoutConfiguration) => void;
}

export const CheckoutCore: React.FC<CheckoutCoreProps> = ({
  config: propConfig,
  products: initialProducts,
  isPreview: propIsPreview,
  onOrderSubmit,
  onBackToShop,
  onConfigChange,
}) => {
  const {
    // State from context
    formData,
    errors,
    currentStep,
    isSubmitting,
    loading,
    products,
    appliedCoupon,
    selectedAddons,
    
    // Computed values from context
    theme,
    steps,
    stepMode,
    isEnableHeader,
    config,
    isPreview,
    
    // Handlers from context
    handleFieldChange,
    handleDeleteField,
    handleMoveField,
    handleReorderFields,
    handleAddField,
    handleNext,
    handleBack,
    handleSubmit,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleUpdateQuantity,
    handleRemoveProduct,
    handleAddonToggle,
    handleAddonQuantityChange,
  } = useCheckoutBuilder();
  const {selectedElement} = useElementSelection();

  const router = useRouter();

  const handleBackToShop = () => {
    if (onBackToShop) {
      onBackToShop();
    } else {
      // Default behavior
      router.push("/shop");
    }
  };

  const submitButtonElement = {
    id: "submit-button",
    type: "button" as const,
    label: "Complete Order",
    subtitle: "Complete your purchase securely",
    path: "steps[0].sections[0].fields[0].submitButton",
    styling: {
      backgroundColor: config.checkoutConfig.theme.backgroundColor,
      color: config.checkoutConfig.theme.textColor,
      padding: config.checkoutConfig.theme.spacing.xl,
      margin: "0 0 24px 0",
      borderRadius: "0px",
      border: "none",
      fontSize: "28px",
      fontWeight: "700",
    },
  };

  const checkoutLayoutElement = {
    id: "checkout-page",
    type: "checkout-page" as const,
    label: "Checkout Page",
    subtitle: "Checkout Page",
    path: "checkoutConfig",
    styling: {
      backgroundColor: config.checkoutConfig.theme.backgroundColor,
      color: config.checkoutConfig.theme.textColor,
      padding: config.checkoutConfig.theme.spacing.xl, 
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading checkout...</span>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];

 const getStyle = () => {
  const layoutType = config.checkoutConfig.layout.type;

  if (layoutType === "one_column") {
    return {
      backgroundColor: config.checkoutConfig.layout.oneColumn?.backgroundColor,
      // ...add more as needed
    };
  }

  if (layoutType === "two_column") {
    const twoColumn = config.checkoutConfig.layout.twoColumn!;
    // Find which column has customer_info
    let col = twoColumn.leftColumn;
    if (twoColumn.rightColumn.content === "customer_info") {
      col = twoColumn.rightColumn;
    }
    return {
      backgroundColor: col.backgroundColor,
      primaryColor: col.primaryColor,
      secondaryColor: col.secondaryColor,
      margin: col.margin,
      padding: col.padding,
      borderColor: col.borderColor,
      borderStyle: col.borderStyle,
      borderWidth: col.borderWidth,
      borderRadius: col.borderRadius,
    };
  }

  return {};
 }

  const customerInfoStyle = getStyle();


  return (
    <SelectableElement
    element={checkoutLayoutElement}
    isPreview={isPreview}
  >
    <div
      className="checkout-page"
      style={{
        backgroundColor: theme.backgroundColor,
        minHeight: isPreview ? "100%" : "100vh",
        width: "100%",
      }}
    >
      {isEnableHeader && (
        <SiteHeader
          theme={theme}
          siteName="TechStore"
          onBackToShop={handleBackToShop}
          cartItemCount={products.length}
          isPreview={isPreview}
        />
      )}

      <CheckoutLayout
        theme={theme}
        products={products}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveProduct={handleRemoveProduct}
        layout={config.checkoutConfig.layout}
        selectedAddons={selectedAddons}
        isPreview={isPreview}
      >
        <div className="checkout-content">
          {isEnableHeader && (
            <CheckoutHeader
              config={config.checkoutConfig}
              isPreview={isPreview}
            />
          )}
          {stepMode && (
            <ProgressRenderer
              steps={steps}
              currentStep={currentStep}
              config={config.checkoutConfig.progressBar}
              isPreview={isPreview}
            />
          )}  

          {stepMode ? (
            <div
              className="step-container"
              style={{
                backgroundColor: "white",
                borderRadius: theme.borderRadius,
                padding: theme.spacing.xl,
                boxShadow:
                  theme.colorScheme === "dark"
                    ? "0 4px 6px rgba(0, 0, 0, 0.3)"
                    : "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: theme.spacing.lg,
              }}
            >
              <div
                className="step-header"
                style={{ marginBottom: theme.spacing.lg }}
              >
                <h2
                  style={{
                    color: theme.textColor,
                    fontSize: "24px",
                    fontWeight: "600",
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {currentStepData.title}
                </h2>
                <p
                  style={{
                    color: theme.secondaryColor,
                    fontSize: "14px",
                  }}
                >
                  {currentStepData.description}
                </p>
              </div>

              <div className="step-content">
                {currentStepData.sections.map((section, sectionIndex) => (
                  <SectionRenderer
                    key={section.id}
                    section={section}
                    stepIndex={currentStep}
                    sectionIndex={sectionIndex}
                  />
                ))}
              </div>

              <StepActions
                currentStep={currentStep}
                totalSteps={steps.length}
                isSubmitting={isSubmitting}
                onBack={handleBack}
                onNext={handleNext}
                theme={theme}
                isPreview={isPreview}
              />
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSubmit();
              }}
              style={customerInfoStyle}
            >
              {steps.map((step, stepIndex) => (
                <React.Fragment key={step.id}>
                  <div
                    className="step-header"
                    style={{ marginBottom: theme.spacing.lg }}
                  >
                    <h2
                      style={{
                        color: customerInfoStyle.primaryColor,
                        fontSize: "24px",
                        fontWeight: "600",
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      {step.title}
                    </h2>
                    <p
                      style={{
                        color: customerInfoStyle.secondaryColor,
                        fontSize: "14px",
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                  <div className="step-content">
                    {step.sections.map((section, sectionIndex) => (
                      <SectionRenderer
                        key={section.id}
                        section={section}
                        stepIndex={stepIndex}
                        sectionIndex={sectionIndex}
                      />
                    ))}
                  </div>
                </React.Fragment>
              ))}
              <SelectableElement
                element={submitButtonElement}
                isPreview={isPreview}
              >
                <button
                  type={isPreview ? "button" : "submit"}
                  disabled={isSubmitting}
                  style={{
                    marginTop: theme.spacing.xl,
                    width: "100%",
                    padding: "16px 0",
                    borderRadius: theme.borderRadius,
                    border: "none",
                    backgroundColor: theme.primaryColor,
                    color: theme.textColor,
                    fontSize: theme.fontSize,
                    fontWeight: 600,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Complete Order"
                  )}
                </button>
              </SelectableElement>
            </form>
          )}
        </div>
      </CheckoutLayout>
    </div>
    </SelectableElement>
  );
};
