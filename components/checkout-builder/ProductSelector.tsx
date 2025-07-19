"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, DollarSign, Calendar, AlertTriangle, Info, CheckCircle, ShoppingCart } from 'lucide-react';

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

interface ProductSelectorProps {
  selectedProducts: SelectedProduct[];
  onProductsChange: (products: SelectedProduct[]) => void;
}

export interface SelectedProduct {
  productId: string;
  productName: string;
  selectedPrices: string[]; // Array of price IDs
  quantity: number;
}

const defaultProduct: Product = {
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
            type: 'one_time' as const,
            isDefault: true,
            isActive: true,
        },
        {
            id: 'default-subscription',
            name: 'Default Subscription Price',
            price: 0,
            type: 'subscription' as const,
            isDefault: false,
            isActive: true,
            interval: 'month',
            intervalCount: 1,
        }
    ]
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProducts,
  onProductsChange,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChangingProduct, setIsChangingProduct] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Initialize with default product if no products are selected
  useEffect(() => {
    if (selectedProducts.length === 0) {
      const defaultPrice = defaultProduct.prices.find(p => p.isDefault) || defaultProduct.prices[0];
      const initialProduct: SelectedProduct = {
        productId: defaultProduct.id,
        productName: defaultProduct.name,
        selectedPrices: defaultPrice ? [defaultPrice.id] : [],
        quantity: 1,
      };
      onProductsChange([initialProduct]);
    }
  }, [selectedProducts.length, onProductsChange]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = async (productId: string) => {
    if (!productId) return;

    setIsChangingProduct(true);
    
    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    let product = products.find(p => p.id === productId);
    
    // If product not found in fetched products, use default product
    if (!product && productId === 'default') {
      product = defaultProduct;
    }
    
    if (!product) {
      setIsChangingProduct(false);
      return;
    }

    // Get default price or first price
    const defaultPrice = product.prices.find(p => p.isDefault) || product.prices[0];
    
    const newSelectedProduct: SelectedProduct = {
      productId: product.id,
      productName: product.name,
      selectedPrices: defaultPrice ? [defaultPrice.id] : [],
      quantity: 1,
    };

    // Replace the current selection instead of adding to it
    onProductsChange([newSelectedProduct]);
    setIsChangingProduct(false);
  };

  const handlePriceToggle = (productId: string, priceId: string) => {
    const updatedProducts = selectedProducts.map(product => {
      if (product.productId === productId) {
        const isSelected = product.selectedPrices.includes(priceId);
        const updatedPrices = isSelected
          ? product.selectedPrices.filter(id => id !== priceId)
          : [...product.selectedPrices, priceId];
        
        return {
          ...product,
          selectedPrices: updatedPrices,
        };
      }
      return product;
    });
    onProductsChange(updatedProducts);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const updatedProducts = selectedProducts.map(product => {
      if (product.productId === productId) {
        return {
          ...product,
          quantity: Math.max(1, quantity),
        };
      }
      return product;
    });
    onProductsChange(updatedProducts);
  };

  const formatPrice = (price: ProductPrice) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.price);

    if (price.type === 'subscription' && price.interval && price.intervalCount) {
      return `${formattedPrice}/${price.intervalCount} ${price.interval}`;
    }
    return formattedPrice;
  };

  const getProductById = (productId: string) => {
    let product = products.find(p => p.id === productId);
    if (!product && productId === 'default') {
      product = defaultProduct;
    }
    return product;
  };

  if (loading) {
    return (
      <Card className="border-2 border-dashed border-gray-200">
        <CardContent className="p-8">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 font-medium">Loading products...</p>
            <p className="text-sm text-gray-400">Fetching available products from your store</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentProduct = selectedProducts[0] ? getProductById(selectedProducts[0].productId) : null;
  const selectedPriceCount = selectedProducts[0]?.selectedPrices.length || 0;

  return (
    <Card className="shadow-sm border-2 border-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold">Product Selection</div>
            <div className="text-sm font-normal text-gray-500 mt-1">
              Choose a product to preview your checkout design
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Design Preview:</strong> This checkout design will apply to all products. Select a specific product below to see how your design looks with that product's details.
          </AlertDescription>
        </Alert>

        {/* Product Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Select Product</Label>
            {currentProduct && (
              <Badge variant="secondary" className="text-xs">
                {selectedPriceCount} price option{selectedPriceCount !== 1 ? 's' : ''} selected
              </Badge>
            )}
          </div>
          
          <div className="relative">
            <Select 
              value={selectedProducts[0]?.productId || 'default'} 
              onValueChange={handleProductChange}
              disabled={isChangingProduct}
            >
              <SelectTrigger className={`h-12 ${isChangingProduct ? 'opacity-50' : ''}`}>
                <SelectValue placeholder="Choose a product to preview">
                  {currentProduct && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                        <img
                          src={currentProduct.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=32&h=32&fit=crop&crop=center'}
                          alt={currentProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium truncate">{currentProduct.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {currentProduct.description || 'No description'}
                        </div>
                      </div>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {/* Default Product Option */}
                <SelectItem key={defaultProduct.id} value={defaultProduct.id} className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                      <img
                        src={defaultProduct.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=40&h=40&fit=crop&crop=center'}
                        alt={defaultProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{defaultProduct.name}</div>
                      <div className="text-xs text-gray-500 truncate">{defaultProduct.description}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">Default</Badge>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">Free</span>
                      </div>
                    </div>
                  </div>
                </SelectItem>
                
                {/* Database Products */}
                {products
                  .filter(product => product.isActive)
                  .map(product => (
                    <SelectItem key={product.id} value={product.id} className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                          <img
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=40&h=40&fit=crop&crop=center'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{product.name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {product.description || 'No description'}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {product.prices.length} price{product.prices.length !== 1 ? 's' : ''}
                            </Badge>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">
                              From {formatPrice(product.prices[0] || { price: 0, type: 'one_time' } as ProductPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            {isChangingProduct && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Product Details */}
        {currentProduct && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Label className="text-sm font-medium text-gray-700">Product Configuration</Label>
            </div>
            
            <Card className="border-2 border-green-100 bg-green-50/30">
              <CardContent className="p-5">
                {/* Product Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                    <img
                      src={currentProduct.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center'}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">{currentProduct.name}</h4>
                    {currentProduct.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {currentProduct.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {currentProduct.prices.filter(p => p.isActive).length} price options
                      </Badge>
                      {currentProduct.id === 'default' && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-5">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Quantity</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(selectedProducts[0].productId, selectedProducts[0].quantity - 1)}
                      disabled={selectedProducts[0].quantity <= 1}
                      className="w-10 h-10 p-0"
                    >
                      -
                    </Button>
                    <div className="w-16 h-10 flex items-center justify-center border border-gray-200 rounded-md bg-white font-medium">
                      {selectedProducts[0].quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(selectedProducts[0].productId, selectedProducts[0].quantity + 1)}
                      className="w-10 h-10 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Price Options */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Price Options</Label>
                  <div className="space-y-3">
                    {currentProduct.prices
                      .filter(price => price.isActive)
                      .map((price) => (
                        <div key={price.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                          <Checkbox
                            id={`price-${price.id}`}
                            checked={selectedProducts[0].selectedPrices.includes(price.id)}
                            onCheckedChange={() => handlePriceToggle(selectedProducts[0].productId, price.id)}
                          />
                          <Label 
                            htmlFor={`price-${price.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{price.name}</span>
                                {price.isDefault && (
                                  <Badge variant="secondary" className="text-xs">
                                    Default
                                  </Badge>
                                )}
                                {price.type === 'subscription' && (
                                  <Badge variant="outline" className="text-xs">
                                    Subscription
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="font-semibold text-green-600">{formatPrice(price)}</span>
                                </div>
                                {price.type === 'subscription' && (
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                  </div>
                  
                  {selectedPriceCount === 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Please select at least one price option to continue.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!currentProduct && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">No Product Selected</h3>
            <p className="text-sm text-gray-500">
              Select a product above to configure your checkout preview
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 