'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Package, Calendar, DollarSign, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  prices: ProductPrice[];
}

interface ProductPrice {
  id: string;
  name: string;
  price: number;
  type: string;
  interval?: string;
  intervalCount?: number;
  isDefault: boolean;
  isActive: boolean;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: ProductPrice) => {
    const basePrice = `$${price.price}`;
    
    if (price.type === 'subscription' && price.interval && price.intervalCount) {
      return `${basePrice}/${price.intervalCount} ${price.interval}`;
    }
    
    return basePrice;
  };

  const getPriceTypeLabel = (type: string) => {
    return type === 'subscription' ? 'Subscription' : 'One-time';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copySlug = async () => {
    if (!product) return;
    try {
      await navigator.clipboard.writeText(product.slug);
      alert('Slug copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy slug:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">Product Details</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/products/${product.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700"
          >
            {deleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {product.description && (
                    <p className="text-gray-600">{product.description}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Slug:</span>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600 font-mono text-xs">{product.slug}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={copySlug}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <p className="text-gray-600">{formatDate(product.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Updated:</span>
                  <p className="text-gray-600">{formatDate(product.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Options</CardTitle>
            </CardHeader>
            <CardContent>
              {product.prices.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pricing options available.</p>
              ) : (
                <div className="space-y-4">
                  {product.prices.map((price) => (
                    <div key={price.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{price.name}</h4>
                          {price.isDefault && (
                            <Badge variant="default" className="text-xs">Default</Badge>
                          )}
                          <Badge variant={price.isActive ? "default" : "secondary"} className="text-xs">
                            {price.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {formatPrice(price)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getPriceTypeLabel(price.type)}
                          </div>
                        </div>
                      </div>
                      
                                             <div className="grid grid-cols-2 gap-4 text-sm">
                         {price.type === 'subscription' && price.interval && price.intervalCount && (
                           <div>
                             <span className="font-medium text-gray-700">Billing:</span>
                             <p className="text-gray-600">Every {price.intervalCount} {price.interval}(s)</p>
                           </div>
                         )}
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/admin/products/${product.id}/edit`} className="w-full">
                <Button className="w-full" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
              </Link>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  // TODO: Implement duplicate functionality
                  alert('Duplicate functionality coming soon!');
                }}
              >
                <Package className="w-4 h-4 mr-2" />
                Duplicate Product
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  // TODO: Implement preview functionality
                  alert('Preview functionality coming soon!');
                }}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Preview Checkout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Prices:</span>
                <span className="font-medium">{product.prices.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Prices:</span>
                <span className="font-medium">
                  {product.prices.filter(p => p.isActive).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">One-time Prices:</span>
                <span className="font-medium">
                  {product.prices.filter(p => p.type === 'one_time').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subscription Prices:</span>
                <span className="font-medium">
                  {product.prices.filter(p => p.type === 'subscription').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 