import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { CheckoutConfiguration, Addon } from "./types";
import { validateStep } from "./utils/validation";
import { CheckoutHeader } from "./CheckoutHeader";
import { ProgressRenderer } from "./progress/ProgressRenderer";
import { SectionRenderer } from "./SectionRenderer";
import { StepActions } from "./StepActions";
import { SiteHeader } from "./SiteHeader";
import { CheckoutLayout } from "./CheckoutLayout";
import { useRouter } from "next/navigation";
import { SelectableElement } from "./SelectableElement";

interface Coupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
}

interface OrderData {
  formData: Record<string, any>;
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
  }>;
  selectedAddons: Addon[];
  appliedCoupon: Coupon | null;
  total: number;
}

interface CheckoutCoreProps {
  config: CheckoutConfiguration;
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
  onOrderSubmit?: (orderData: OrderData) => void;
  onBackToShop?: () => void;
  onConfigChange?: (config: CheckoutConfiguration) => void;
}

export const CheckoutCore: React.FC<CheckoutCoreProps> = ({
  config,
  products: initialProducts = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      description:
        "Noise-cancelling Bluetooth headphones with premium sound quality",
      price: 199.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop&crop=center",
      variant: "Black",
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      description: "Advanced fitness tracking with heart rate monitor and GPS",
      price: 299.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop&crop=center",
      variant: "Silver",
    },
  ],
  isPreview = false,
  onOrderSubmit,
  onBackToShop,
  onConfigChange,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(initialProducts);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const router = useRouter();

  const theme = config.checkoutConfig.theme;
  const steps = config.steps;
  const stepMode = config.checkoutConfig.stepMode !== false;
  const isEnableHeader = config.checkoutConfig.enableHeader !== false;

  // Load configuration from API (only in live mode)
  useEffect(() => {
    if (!isPreview) {
      const loadConfig = async () => {
        try {
          // You can load config from API here
          // const response = await fetch('/api/checkout/config');
          // const data = await response.json();
          // setConfig(data);
          setLoading(false);
        } catch (error) {
          console.error("Error loading checkout config:", error);
          setLoading(false);
        }
      };

      loadConfig();
    } else {
      setLoading(false);
    }
  }, [isPreview]);

  const handleFieldChange = useCallback(
    (fieldId: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }));

      // Clear error when user starts typing
      if (errors[fieldId]) {
        setErrors((prev) => ({
          ...prev,
          [fieldId]: null,
        }));
      }
    },
    [errors]
  );

  const handleDeleteField = useCallback(
    (fieldId: string) => {
      // Find and remove the field from the configuration
      const updatedConfig = { ...config };

      for (
        let stepIndex = 0;
        stepIndex < updatedConfig.steps.length;
        stepIndex++
      ) {
        const step = updatedConfig.steps[stepIndex];
        for (
          let sectionIndex = 0;
          sectionIndex < step.sections.length;
          sectionIndex++
        ) {
          const section = step.sections[sectionIndex];
          if (section.fields) {
            const fieldIndex = section.fields.findIndex(
              (field) => field.id === fieldId
            );
            if (fieldIndex !== -1) {
              // Remove the field
              section.fields.splice(fieldIndex, 1);
              // Also remove from form data
              setFormData((prev) => {
                const newFormData = { ...prev };
                delete newFormData[fieldId];
                return newFormData;
              });
              // Also remove from errors
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
              });
              // Update the configuration
              if (onConfigChange) {
                onConfigChange(updatedConfig);
              }
              return;
            }
          }
        }
      }
    },
    [config, onConfigChange]
  );

  const handleMoveField = useCallback(
    (fieldId: string, direction: "up" | "down") => {
      // Find the field and move it up or down within its section
      const updatedConfig = { ...config };

      for (
        let stepIndex = 0;
        stepIndex < updatedConfig.steps.length;
        stepIndex++
      ) {
        const step = updatedConfig.steps[stepIndex];
        for (
          let sectionIndex = 0;
          sectionIndex < step.sections.length;
          sectionIndex++
        ) {
          const section = step.sections[sectionIndex];
          if (section.fields) {
            const fieldIndex = section.fields.findIndex(
              (field) => field.id === fieldId
            );
            if (fieldIndex !== -1) {
              const newIndex =
                direction === "up" ? fieldIndex - 1 : fieldIndex + 1;

              // Check bounds
              if (newIndex >= 0 && newIndex < section.fields.length) {
                // Swap the fields
                const temp = section.fields[fieldIndex];
                section.fields[fieldIndex] = section.fields[newIndex];
                section.fields[newIndex] = temp;
                // Update the configuration
                if (onConfigChange) {
                  onConfigChange(updatedConfig);
                }
                return;
              }
            }
          }
        }
      }
    },
    [config, onConfigChange]
  );

  const handleReorderFields = useCallback(
    (sectionId: string, oldIndex: number, newIndex: number) => {
      console.log("handleReorderFields called:", {
        sectionId,
        oldIndex,
        newIndex,
      });

      // Reorder fields within a section using drag and drop
      const updatedConfig = { ...config };

      for (
        let stepIndex = 0;
        stepIndex < updatedConfig.steps.length;
        stepIndex++
      ) {
        const step = updatedConfig.steps[stepIndex];
        for (
          let sectionIndex = 0;
          sectionIndex < step.sections.length;
          sectionIndex++
        ) {
          const section = step.sections[sectionIndex];
          if (section.id === sectionId && section.fields) {
            console.log(
              "Found section:",
              section.id,
              "Fields before:",
              section.fields.map((f) => f.id)
            );

            // Move the field from oldIndex to newIndex
            const [movedField] = section.fields.splice(oldIndex, 1);
            section.fields.splice(newIndex, 0, movedField);

            console.log(
              "Fields after reorder:",
              section.fields.map((f) => f.id)
            );
            console.log("Moved field:", movedField.id);

            // Update the configuration
            if (onConfigChange) {
              console.log("Calling onConfigChange with updated config");
              onConfigChange(updatedConfig);
            } else {
              console.log("onConfigChange is not available");
            }
            return;
          }
        }
      }

      console.log("Section not found or no fields");
    },
    [config, onConfigChange]
  );

  const handleNext = () => {
    const stepErrors = validateStep(steps[currentStep], formData);
    setErrors(stepErrors);

    const hasErrors = Object.values(stepErrors).some((error) => error !== null);

    if (!hasErrors) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderData: OrderData = {
        formData,
        products,
        selectedAddons,
        appliedCoupon,
        total: calculateTotal(),
      };

      if (onOrderSubmit) {
        onOrderSubmit(orderData);
      } else {
        // Default behavior
        alert("Order submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error submitting order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const addonsTotal = selectedAddons.reduce(
      (sum, addon) => sum + addon.price * (addon.quantity || 1),
      0
    );
    const shipping = 5.99;

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        discount = (subtotal + addonsTotal) * (appliedCoupon.discount / 100);
      } else {
        discount = appliedCoupon.discount;
      }
    }

    const tax = (subtotal + addonsTotal - discount) * 0.08;
    return subtotal + addonsTotal + shipping + tax - discount;
  };

  const handleApplyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, quantity } : product
      )
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const handleBackToShop = () => {
    if (onBackToShop) {
      onBackToShop();
    } else {
      // Default behavior
      router.push("/shop");
    }
  };

  const handleAddonToggle = (addon: Addon) => {
    setSelectedAddons((prev) => {
      const isSelected = prev.some((a) => a.id === addon.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, { ...addon, quantity: 1 }];
      }
    });
  };

  const handleAddonQuantityChange = (addonId: string, quantity: number) => {
    setSelectedAddons((prev) =>
      prev.map((addon) =>
        addon.id === addonId ? { ...addon, quantity } : addon
      )
    );
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
    id: "checkout-layout",
    type: "checkout-layout" as const,
    label: "Checkout Layout",
    subtitle: "Checkout Layout",
    path: "checkoutConfig.layout",
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
        color: theme.textColor,
        width: "100%",
        margin: 0,
        padding: 0,
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
                backgroundColor: theme.backgroundColor,
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
                    formData={formData}
                    onFieldChange={handleFieldChange}
                    errors={errors}
                    theme={theme}
                    config={config}
                    selectedAddons={selectedAddons}
                    onAddonToggle={handleAddonToggle}
                    onAddonQuantityChange={handleAddonQuantityChange}
                    isPreview={isPreview}
                    onDeleteField={handleDeleteField}
                    onMoveField={handleMoveField}
                    onReorderFields={handleReorderFields}
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
                // Validate all steps
                let allValid = true;
                let allErrors: Record<string, string | null> = {};
                steps.forEach((step) => {
                  const stepErrors = validateStep(step, formData);
                  if (Object.values(stepErrors).some((err) => err))
                    allValid = false;
                  allErrors = { ...allErrors, ...stepErrors };
                });
                setErrors(allErrors);
                if (allValid) {
                  await handleSubmit();
                }
              }}
              style={{
                backgroundColor: theme.backgroundColor,
                borderRadius: theme.borderRadius,
                padding: theme.spacing.xl,
                boxShadow:
                  theme.colorScheme === "dark"
                    ? "0 4px 6px rgba(0, 0, 0, 0.3)"
                    : "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: theme.spacing.lg,
              }}
            >
              {steps.map((step, stepIndex) => (
                <React.Fragment key={step.id}>
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
                      {step.title}
                    </h2>
                    <p
                      style={{
                        color: theme.secondaryColor,
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
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        errors={errors}
                        theme={theme}
                        config={config}
                        selectedAddons={selectedAddons}
                        onAddonToggle={handleAddonToggle}
                        onAddonQuantityChange={handleAddonQuantityChange}
                        isPreview={isPreview}
                        onDeleteField={handleDeleteField}
                        onMoveField={handleMoveField}
                        onReorderFields={handleReorderFields}
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
