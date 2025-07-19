import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckoutConfiguration, Addon, Field, Theme } from '../types';
import { validateStep } from '../utils/validation';
import { createFieldFromType } from '../utils/fieldTypes';
import { SelectedProduct } from '../ProductSelector';

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

interface CheckoutBuilderContextType {
  // Configuration state
  config: CheckoutConfiguration;
  setConfig: (config: CheckoutConfiguration) => void;
  
  // Form state
  formData: Record<string, any>;
  setFormData: (formData: Record<string, any>) => void;
  errors: Record<string, string | null>;
  setErrors: (errors: Record<string, string | null>) => void;
  
  // UI state
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isPreview: boolean;
  
  // Product state
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
  }>;
  setProducts: (products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
  }>) => void;
  
  // Selected Products state (for checkout builder)
  selectedProducts: SelectedProduct[];
  setSelectedProducts: (products: SelectedProduct[]) => void;
  
  // Coupon state
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  
  // Addon state
  selectedAddons: Addon[];
  setSelectedAddons: (addons: Addon[]) => void;
  
  // Computed values
  theme: Theme;
  steps: CheckoutConfiguration['steps'];
  stepMode: boolean;
  isEnableHeader: boolean;
  
  // Event handlers
  handleFieldChange: (fieldId: string, value: any) => void;
  handleDeleteField: (fieldId: string) => void;
  handleMoveField: (fieldId: string, direction: 'up' | 'down') => void;
  handleReorderFields: (sectionId: string, oldIndex: number, newIndex: number) => void;
  handleAddField: (stepId: string, sectionId: string, fieldType?: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => Promise<void>;
  handleApplyCoupon: (coupon: Coupon) => void;
  handleRemoveCoupon: () => void;
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  handleRemoveProduct: (productId: string) => void;
  handleAddonToggle: (addon: Addon) => void;
  handleAddonQuantityChange: (addonId: string, quantity: number) => void;
  calculateTotal: () => number;
  
  // Save/Load handlers
  handleSaveConfig: () => Promise<{ success: boolean; message: string }>;
  handleLoadConfig: () => Promise<{ success: boolean; data?: CheckoutConfiguration; message: string }>;
  
  // Callbacks
  onOrderSubmit?: (orderData: OrderData) => void;
  onBackToShop?: () => void;
  onConfigChange?: (config: CheckoutConfiguration) => void;
}

const CheckoutBuilderContext = createContext<CheckoutBuilderContextType | undefined>(undefined);

export const useCheckoutBuilder = () => {
  const context = useContext(CheckoutBuilderContext);
  if (context === undefined) {
    throw new Error('useCheckoutBuilder must be used within a CheckoutBuilderProvider');
  }
  return context;
};

interface CheckoutBuilderProviderProps {
  children: ReactNode;
  initialConfig: CheckoutConfiguration;
  initialProducts?: Array<{
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

export const CheckoutBuilderProvider: React.FC<CheckoutBuilderProviderProps> = ({
  children,
  initialConfig,
  initialProducts = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      description: "Noise-cancelling Bluetooth headphones with premium sound quality",
      price: 199.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop&crop=center",
      variant: "Black",
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      description: "Advanced fitness tracking with heart rate monitor and GPS",
      price: 299.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop&crop=center",
      variant: "Silver",
    },
  ],
  isPreview = false,
  onOrderSubmit,
  onBackToShop,
  onConfigChange,
}) => {
  // Configuration state
  const [config, setConfig] = useState<CheckoutConfiguration>(initialConfig);
  
  // Form state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  
  // UI state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Product state
  const [products, setProducts] = useState(initialProducts);
  
  // Selected Products state (for checkout builder)
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  
  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  
  // Addon state
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  // Computed values
  const theme = config.checkoutConfig.theme;
  const steps = config.steps;
  const stepMode = config.checkoutConfig.stepMode !== false;
  const isEnableHeader = config.checkoutConfig.enableHeader !== false;

  // Load configuration from API (only in live mode)
  React.useEffect(() => {
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

  // Event handlers
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
      const updatedConfig = { ...config };

      for (let stepIndex = 0; stepIndex < updatedConfig.steps.length; stepIndex++) {
        const step = updatedConfig.steps[stepIndex];
        for (let sectionIndex = 0; sectionIndex < step.sections.length; sectionIndex++) {
          const section = step.sections[sectionIndex];
          if (section.fields) {
            const fieldIndex = section.fields.findIndex((field) => field.id === fieldId);
            if (fieldIndex !== -1) {
              section.fields.splice(fieldIndex, 1);
              setFormData((prev) => {
                const newFormData = { ...prev };
                delete newFormData[fieldId];
                return newFormData;
              });
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
              });
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
      const updatedConfig = { ...config };

      for (let stepIndex = 0; stepIndex < updatedConfig.steps.length; stepIndex++) {
        const step = updatedConfig.steps[stepIndex];
        for (let sectionIndex = 0; sectionIndex < step.sections.length; sectionIndex++) {
          const section = step.sections[sectionIndex];
          if (section.fields) {
            const fieldIndex = section.fields.findIndex((field) => field.id === fieldId);
            if (fieldIndex !== -1) {
              const newIndex = direction === "up" ? fieldIndex - 1 : fieldIndex + 1;

              if (newIndex >= 0 && newIndex < section.fields.length) {
                const temp = section.fields[fieldIndex];
                section.fields[fieldIndex] = section.fields[newIndex];
                section.fields[newIndex] = temp;
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
      const updatedConfig = { ...config };

      for (let stepIndex = 0; stepIndex < updatedConfig.steps.length; stepIndex++) {
        const step = updatedConfig.steps[stepIndex];
        for (let sectionIndex = 0; sectionIndex < step.sections.length; sectionIndex++) {
          const section = step.sections[sectionIndex];
          if (section.id === sectionId && section.fields) {
            const [movedField] = section.fields.splice(oldIndex, 1);
            section.fields.splice(newIndex, 0, movedField);

            if (onConfigChange) {
              onConfigChange(updatedConfig);
            }
            return;
          }
        }
      }
    },
    [config, onConfigChange]
  );

  const handleAddField = useCallback(
    (stepId: string, sectionId: string, fieldType: string = 'text') => {
      const newField = createFieldFromType(fieldType);
      const updatedConfig = { ...config };

      for (let stepIndex = 0; stepIndex < updatedConfig.steps.length; stepIndex++) {
        const step = updatedConfig.steps[stepIndex];
        if (step.id === stepId) {
          for (let sectionIndex = 0; sectionIndex < step.sections.length; sectionIndex++) {
            const section = step.sections[sectionIndex];
            if (section.id === sectionId) {
              if (!section.fields) {
                section.fields = [];
              }
              
              section.fields.push(newField);
              
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

  const handleNext = useCallback(() => {
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
  }, [currentStep, steps, formData]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
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
        alert("Order submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error submitting order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, products, selectedAddons, appliedCoupon, onOrderSubmit]);

  const calculateTotal = useCallback(() => {
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
  }, [products, selectedAddons, appliedCoupon]);

  const handleApplyCoupon = useCallback((coupon: Coupon) => {
    setAppliedCoupon(coupon);
  }, []);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, quantity } : product
      )
    );
  }, []);

  const handleRemoveProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }, []);

  const handleAddonToggle = useCallback((addon: Addon) => {
    setSelectedAddons((prev) => {
      const isSelected = prev.some((a) => a.id === addon.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, { ...addon, quantity: 1 }];
      }
    });
  }, []);

  const handleAddonQuantityChange = useCallback((addonId: string, quantity: number) => {
    setSelectedAddons((prev) =>
      prev.map((addon) =>
        addon.id === addonId ? { ...addon, quantity } : addon
      )
    );
  }, []);

  // Save configuration to database
  const handleSaveConfig = useCallback(async () => {
    try {
      const response = await fetch('/api/checkout-builder/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: config,
          name: 'Checkout Configuration',
          description: 'Checkout builder configuration'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message || 'Configuration saved successfully' };
      } else {
        return { success: false, message: result.error || 'Failed to save configuration' };
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      return { success: false, message: 'Error saving configuration' };
    }
  }, [config]);

  // Load configuration from database
  const handleLoadConfig = useCallback(async () => {
    try {
      const response = await fetch('/api/checkout-builder/save');
      const result = await response.json();

      if (response.ok && result.data) {
        setConfig(result.data.config as CheckoutConfiguration);
        return { 
          success: true, 
          data: result.data.config as CheckoutConfiguration,
          message: 'Configuration loaded successfully' 
        };
      } else {
        return { success: false, message: result.error || 'No configuration found' };
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      return { success: false, message: 'Error loading configuration' };
    }
  }, [setConfig]);

  const value: CheckoutBuilderContextType = {
    // Configuration state
    config,
    setConfig,
    
    // Form state
    formData,
    setFormData,
    errors,
    setErrors,
    
    // UI state
    currentStep,
    setCurrentStep,
    isSubmitting,
    setIsSubmitting,
    loading,
    setLoading,
    isPreview,
    
    // Product state
    products,
    setProducts,
    
    // Selected Products state (for checkout builder)
    selectedProducts,
    setSelectedProducts,
    
    // Coupon state
    appliedCoupon,
    setAppliedCoupon,
    
    // Addon state
    selectedAddons,
    setSelectedAddons,
    
    // Computed values
    theme,
    steps,
    stepMode,
    isEnableHeader,
    
    // Event handlers
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
    calculateTotal,
    
    // Save/Load handlers
    handleSaveConfig,
    handleLoadConfig,
    
    // Callbacks
    onOrderSubmit,
    onBackToShop,
    onConfigChange,
  };

  return (
    <CheckoutBuilderContext.Provider value={value}>
      {children}
    </CheckoutBuilderContext.Provider>
  );
}; 