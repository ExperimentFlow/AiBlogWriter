"use client";

import React from "react";
import { CheckoutCore } from "../../components/checkout-builder/CheckoutCore";
import { defaultCheckoutConfig } from "../../components/checkout-builder/config/defaultConfig";
import { CheckoutConfiguration } from "../../components/checkout-builder/types";
import { CheckoutBuilderProvider } from "../../components/checkout-builder/contexts/CheckoutBuilderContext";

// Main Checkout Builder Component
const CheckoutBuilder = ({ config = defaultCheckoutConfig }: { config?: CheckoutConfiguration }) => {
  const handleOrderSubmit = (orderData: any) => {
    // Handle real order submission
    console.log('Live order submitted:', orderData);
    
    // Here you would:
    // 1. Send to payment processor
    // 2. Save to database
    // 3. Send confirmation email
    // 4. Redirect to success page
    
    alert("Order submitted successfully! Redirecting to payment...");
  };

  const handleBackToShop = () => {
    // Navigate back to shop
    window.history.back();
  };

  return (
    <CheckoutBuilderProvider
      initialConfig={config}
      isPreview={false}
      onOrderSubmit={handleOrderSubmit}
      onBackToShop={handleBackToShop}
    >
      <CheckoutCore />
    </CheckoutBuilderProvider>
  );
};

export default CheckoutBuilder; 