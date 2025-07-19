'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useProductValidation } from '@/hooks/useProductValidation';
import { ProductInput } from '@/lib/validations/product';
import { generateSlug } from '@/lib/utils';

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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true,
  });
  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const { validateProduct, getFieldError, clearFieldError } = useProductValidation();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        const product = data.product;
        
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          imageUrl: product.imageUrl || '',
          isActive: product.isActive,
        });
        
        setPrices(product.prices.map((price: any) => ({
          id: price.id,
          name: price.name,
          price: price.price,
          type: price.type,
          interval: price.interval || undefined,
          intervalCount: price.intervalCount || undefined,
          isDefault: price.isDefault,
          isActive: price.isActive,
        })));
      } else {
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const addPrice = () => {
    const newPrice: ProductPrice = {
      id: `temp-${Date.now()}`,
      name: '',
      price: 0,
      type: 'one_time',
      isDefault: false,
      isActive: true,
    };
    setPrices([...prices, newPrice]);
  };

  const removePrice = (id: string) => {
    setPrices(prices.filter(price => price.id !== id));
  };

  const updatePrice = (id: string, field: keyof ProductPrice, value: any) => {
    setPrices(prices.map(price => {
      if (price.id === id) {
        return { ...price, [field]: value };
      }
      return price;
    }));
  };

  const setDefaultPrice = (id: string) => {
    setPrices(prices.map(price => ({
      ...price,
      isDefault: price.id === id
    })));
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });
    // Auto-generate slug if it's empty or matches the previous name
    if (!formData.slug || formData.slug === generateSlug(formData.name)) {
      setFormData(prev => ({ ...prev, name, slug: generateSlug(name) }));
    } else {
      setFormData(prev => ({ ...prev, name }));
    }
    clearFieldError('name');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const productData: ProductInput = {
      ...formData,
      prices: prices.map(price => ({
        name: price.name,
        price: price.price,
        type: price.type,
        interval: price.interval || undefined,
        intervalCount: price.intervalCount || undefined,
        isDefault: price.isDefault,
        isActive: price.isActive,
      })),
    };

    const validation = validateProduct(productData);
    if (!validation.isValid) {
      return; 
    }
    setSaving(true);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        router.push(`/admin/products/${id}`);
      } else {
        const error = await response.json();
        if (error.details) {
          // Handle validation errors from server
          alert(`Validation errors: ${error.details.map((e: any) => e.message).join(', ')}`);
        } else {
          alert(`Error: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/products/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Product
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update product details and pricing options</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter product name"
                required
                className={getFieldError('name') ? 'border-red-500' : ''}
              />
              {getFieldError('name') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('name')}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value });
                  clearFieldError('slug');
                }}
                placeholder="product-slug"
                required
                className={getFieldError('slug') ? 'border-red-500' : ''}
              />
              {getFieldError('slug') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('slug')}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                URL-friendly version of the product name. Only lowercase letters, numbers, and hyphens allowed.
              </p>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Options */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pricing Options</CardTitle>
              <Button type="button" onClick={addPrice} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Price
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {prices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No pricing options added yet.</p>
                <p className="text-sm">Click "Add Price" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getFieldError('prices') && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{getFieldError('prices')}</p>
                  </div>
                )}
                {prices.map((price, index) => (
                  <div key={price.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Price Option {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultPrice(price.id)}
                          className={price.isDefault ? 'bg-blue-50 border-blue-200' : ''}
                        >
                          {price.isDefault ? 'Default' : 'Set Default'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePrice(price.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={price.name}
                          onChange={(e) => {
                            updatePrice(price.id, 'name', e.target.value);
                            clearFieldError(`prices.${index}.name`);
                          }}
                          placeholder="e.g., Basic Plan, Pro Plan"
                          required
                          className={getFieldError(`prices.${index}.name`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`prices.${index}.name`) && (
                          <p className="text-sm text-red-600 mt-1">{getFieldError(`prices.${index}.name`)}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label>Price *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={price.price}
                          onChange={(e) => {
                            updatePrice(price.id, 'price', parseFloat(e.target.value) || 0);
                            clearFieldError(`prices.${index}.price`);
                          }}
                          placeholder="0.00"
                          required
                          className={getFieldError(`prices.${index}.price`) ? 'border-red-500' : ''}
                        />
                        {getFieldError(`prices.${index}.price`) && (
                          <p className="text-sm text-red-600 mt-1">{getFieldError(`prices.${index}.price`)}</p>
                        )}
                      </div>
                      

                      
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={price.type}
                          onValueChange={(value: 'one_time' | 'subscription') => {
                            updatePrice(price.id, 'type', value);
                            clearFieldError(`prices.${index}.type`);
                          }}
                        >
                          <SelectTrigger className={getFieldError(`prices.${index}.type`) ? 'border-red-500' : ''}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one_time">One-time</SelectItem>
                            <SelectItem value="subscription">Subscription</SelectItem>
                          </SelectContent>
                        </Select>
                        {getFieldError(`prices.${index}.type`) && (
                          <p className="text-sm text-red-600 mt-1">{getFieldError(`prices.${index}.type`)}</p>
                        )}
                      </div>
                    </div>
                    
                    {price.type === 'subscription' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Interval</Label>
                          <Select
                            value={price.interval || ''}
                            onValueChange={(value) => {
                              updatePrice(price.id, 'interval', value);
                              clearFieldError(`prices.${index}.interval`);
                            }}
                          >
                            <SelectTrigger className={getFieldError(`prices.${index}.interval`) ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="month">Month</SelectItem>
                              <SelectItem value="year">Year</SelectItem>
                            </SelectContent>
                          </Select>
                          {getFieldError(`prices.${index}.interval`) && (
                            <p className="text-sm text-red-600 mt-1">{getFieldError(`prices.${index}.interval`)}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label>Interval Count</Label>
                          <Input
                            type="number"
                            min="1"
                            value={price.intervalCount || ''}
                            onChange={(e) => {
                              updatePrice(price.id, 'intervalCount', parseInt(e.target.value) || 1);
                              clearFieldError(`prices.${index}.intervalCount`);
                            }}
                            placeholder="1"
                            className={getFieldError(`prices.${index}.intervalCount`) ? 'border-red-500' : ''}
                          />
                          {getFieldError(`prices.${index}.intervalCount`) && (
                            <p className="text-sm text-red-600 mt-1">{getFieldError(`prices.${index}.intervalCount`)}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={price.isActive}
                        onCheckedChange={(checked) => updatePrice(price.id, 'isActive', checked)}
                      />
                      <Label>Active</Label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href={`/admin/products/${id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving || prices.length === 0}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 