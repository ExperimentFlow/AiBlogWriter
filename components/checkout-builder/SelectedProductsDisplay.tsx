"use client";

import React, { useState, useEffect } from 'react';
import { ProductSummary } from './ProductSummary';
import { SelectedProduct } from './ProductSelector';
import { useCheckoutBuilder } from './contexts/CheckoutBuilderContext';

interface ProductPrice {
  id: string;
  name: string;
  price: number;
  type: 'one_time' | 'subscription';
  interval?: string | null;
  intervalCount?: number | null;
  isDefault: boolean;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  prices: ProductPrice[];
}

interface SelectedProductsDisplayProps {
  selectedProducts: SelectedProduct[];
  isPreview?: boolean;
}

export const SelectedProductsDisplay: React.FC<SelectedProductsDisplayProps> = ({
  selectedProducts,
  isPreview = false,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { theme, appliedCoupon, selectedAddons } = useCheckoutBuilder();

  // Add this at the top, matching the defaultProduct from ProductSelector
  const defaultProduct = {
    id: 'default',
    name: 'Default Product',
    slug: 'default',
    description: 'Default product description',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=20&h=20&fit=crop&crop=center',
    isActive: true,
    prices: [
      {
        id: 'default',
        name: 'Default Price',
        price: 0,
        type: 'one_time',
        isDefault: true,
        isActive: true,
      },
      {
        id: 'default-subscription',
        name: 'Default Subscription Price',
        price: 0,
        type: 'subscription',
        isDefault: false,
        isActive: true,
        interval: 'month',
        intervalCount: 1,
      }
    ]
  };

  // Fetch all products to get their details
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          // Prepend defaultProduct to the products array
          setProducts([defaultProduct, ...(data.products || [])]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Convert selected products to the format expected by ProductSummary
  const convertedProducts = selectedProducts.map(selectedProduct => {
    const product = products.find(p => p.id === selectedProduct.productId);
    if (!product) return null;

    // Calculate total price for selected price options
    const selectedPriceDetails = product.prices.filter(price => 
      selectedProduct.selectedPrices.includes(price.id)
    );
    
    const totalPrice = selectedPriceDetails.reduce((sum, price) => sum + price.price, 0);
    const averagePrice = selectedPriceDetails.length > 0 ? totalPrice / selectedPriceDetails.length : 0;

    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: averagePrice,
      quantity: selectedProduct.quantity,
      image: product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop&crop=center',
      variant: selectedPriceDetails.length > 1 ? `${selectedPriceDetails.length} options selected` : selectedPriceDetails[0]?.name,
    };
  }).filter((product): product is NonNullable<typeof product> => product !== null);

  // If no products are selected, show a placeholder
  if (selectedProducts.length === 0) {
    return (
      <div
        className="product-summary"
        style={{ 
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.lg,
          border: `1px solid ${theme.borderColor}`,
          borderRadius: theme.borderRadius,
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
        }}
      >
        <h3
          style={{
            color: theme.textColor,
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: theme.spacing.md,
          }}
        >
          Order Summary
        </h3>
        <div
          style={{
            textAlign: 'center',
            padding: theme.spacing.xl,
            color: theme.secondaryColor,
          }}
        >
          <p>No products selected</p>
          <p style={{ fontSize: '14px', marginTop: theme.spacing.sm }}>
            Add products from the product selector to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductSummary
      products={convertedProducts}
      theme={theme}
      appliedCoupon={appliedCoupon}
      selectedAddons={selectedAddons}
      isPreview={isPreview}
    />
  );
}; 