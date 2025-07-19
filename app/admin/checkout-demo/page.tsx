"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CheckoutEmbed from '@/components/checkout-embed';
import { ShoppingCart, Settings, Eye, Copy, ExternalLink } from 'lucide-react';

interface Tenant {
  subdomain: string;
  name: string;
  isActive: boolean;
}

export default function CheckoutDemoPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenantInfo();
  }, []);

  const loadTenantInfo = async () => {
    try {
      const response = await fetch('/api/tenant/info');
      if (response.ok) {
        const data = await response.json();
        setTenant(data.tenant);
      }
    } catch (error) {
      console.error('Error loading tenant info:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCheckoutUrl = () => {
    if (tenant) {
      const url = `${window.location.protocol}//${tenant.subdomain}.${window.location.hostname}/checkout`;
      navigator.clipboard.writeText(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Tenant Found</h2>
          <p className="text-gray-600">Please configure your tenant first.</p>
        </div>
      </div>
    );
  }

  const checkoutUrl = `${window.location.protocol}//${tenant.subdomain}.${window.location.hostname}/checkout`;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Checkout Demo</h1>
          <p className="text-gray-600 mt-2">
            Test and showcase your checkout page configuration
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.open('/admin/checkout-builder', '_blank')}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" onClick={() => window.open(checkoutUrl, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Checkout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Tenant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Subdomain</label>
              <p className="text-lg font-semibold">{tenant.subdomain}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="text-lg">{tenant.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <Badge variant={tenant.isActive ? 'default' : 'secondary'}>
                  {tenant.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout URL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Checkout URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Public URL</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={checkoutUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCheckoutUrl}
                  title="Copy URL"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Share this URL with your customers to access the checkout page
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CheckoutEmbed
              subdomain={tenant.subdomain}
              buttonText="Test Checkout"
              buttonVariant="default"
              className="w-full"
            />
            <CheckoutEmbed
              subdomain={tenant.subdomain}
              buttonText="Open in New Tab"
              buttonVariant="outline"
              openInNewTab={true}
              className="w-full"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('/admin/checkout-builder', '_blank')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Checkout
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Embed Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Embed Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="button" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="button">Button Embed</TabsTrigger>
              <TabsTrigger value="modal">Modal Embed</TabsTrigger>
              <TabsTrigger value="iframe">Iframe Embed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="button" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Button Embed</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add a checkout button to your website that opens the checkout in a modal or new tab.
                </p>
                <div className="flex gap-2">
                  <CheckoutEmbed
                    subdomain={tenant.subdomain}
                    buttonText="Buy Now"
                    buttonVariant="default"
                  />
                  <CheckoutEmbed
                    subdomain={tenant.subdomain}
                    buttonText="Checkout"
                    buttonVariant="outline"
                  />
                  <CheckoutEmbed
                    subdomain={tenant.subdomain}
                    buttonText="Purchase"
                    buttonVariant="secondary"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="modal" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Modal Embed</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Open the checkout in a modal dialog within your website.
                </p>
                <CheckoutEmbed
                  subdomain={tenant.subdomain}
                  buttonText="Open Checkout Modal"
                  buttonVariant="default"
                  openInNewTab={false}
                />
              </div>
            </TabsContent>

            <TabsContent value="iframe" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Iframe Embed</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Embed the checkout page directly in your website using an iframe.
                </p>
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={checkoutUrl}
                    className="w-full h-96 border-0"
                    title="Checkout Preview"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <h3>How to integrate the checkout on your website:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>Configure your checkout:</strong> Go to the Checkout Builder to customize the appearance and fields.
              </li>
              <li>
                <strong>Add the checkout button:</strong> Use the CheckoutEmbed component or create a link to the checkout URL.
              </li>
              <li>
                <strong>Test the integration:</strong> Use this demo page to test different embedding options.
              </li>
              <li>
                <strong>Deploy to production:</strong> Replace the demo URLs with your production domain.
              </li>
            </ol>
            
            <h3>Code Example:</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import CheckoutEmbed from '@/components/checkout-embed';

// Button that opens checkout in modal
<CheckoutEmbed 
  subdomain="your-subdomain"
  buttonText="Buy Now"
  buttonVariant="default"
/>

// Button that opens checkout in new tab
<CheckoutEmbed 
  subdomain="your-subdomain"
  buttonText="Checkout"
  openInNewTab={true}
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 