"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  EyeOff,
  Settings,
  Zap,
  Search,
  ChevronDown,
  Globe
} from 'lucide-react';
import { 
  paymentSettingsSchema, 
  type PaymentSettings, 
  currencies, 
  getCurrencySymbol,
  getCurrencyByCode 
} from '@/lib/validations/payment';

export default function PaymentSettingsPage() {
  const [formData, setFormData] = useState<PaymentSettings>({
    publicKey: '',
    secretKey: '',
    currency: 'USD',
  });
  const [errors, setErrors] = useState<Partial<PaymentSettings>>({});
  const [touched, setTouched] = useState<Partial<PaymentSettings>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Load existing settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Validate form on data change, but only show errors for touched fields
  useEffect(() => {
    const result = paymentSettingsSchema.safeParse(formData);
    setIsValid(result.success);
    
    if (result.success) {
      setErrors({});
    } else {
      const fieldErrors = result.error.flatten().fieldErrors;
      // Only show errors for fields that have been touched
      const filteredErrors: Partial<PaymentSettings> = {};
      Object.keys(fieldErrors).forEach(key => {
        const fieldKey = key as keyof PaymentSettings;
        if (touched[fieldKey] && fieldErrors[fieldKey]) {
          // Convert string array to string for display
          filteredErrors[fieldKey] = fieldErrors[fieldKey]?.[0] as any;
        }
      });
      setErrors(filteredErrors);
    }
  }, [formData, touched]);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/stripe/gateway-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setFormData({
            publicKey: data.settings.publicKey || '',
            secretKey: data.settings.secretKey || '',
            currency: (data.settings.currency as PaymentSettings['currency']) || 'USD',
          });
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleInputChange = (field: keyof PaymentSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    setMessage(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const validationResult = paymentSettingsSchema.safeParse(formData);
      if (!validationResult.success) {
        setErrors(validationResult.error.flatten().fieldErrors as Partial<PaymentSettings>);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/gateway-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setTouched({})

      if (response.ok) {
        setMessage({ type: 'success', text: 'Payment settings saved successfully!' });
        setErrors({});
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCurrency = () => {
    return getCurrencyByCode(formData.currency);
  };

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    currency.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    currency.symbol.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const handleCurrencySelect = (currencyCode: string) => {
    handleInputChange('currency', currencyCode);
    setShowCurrencyDropdown(false);
    setCurrencySearch('');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
        </div>
        <p className="text-gray-600">Configure your Stripe payment gateway settings</p>
      </div>

      <div className="grid gap-6">
          {/* Currency Settings Card */}
          <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Currency Settings
            </CardTitle>
            <CardDescription>
              Choose the default currency for your payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-medium">
                Default Currency
              </Label>
              
              {/* Custom Currency Select with Search */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCurrentCurrency()?.symbol}</span>
                    <span>{getCurrentCurrency()?.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {getCurrentCurrency()?.code}
                    </Badge>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCurrencyDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search currencies..."
                          value={currencySearch}
                          onChange={(e) => setCurrencySearch(e.target.value)}
                          className="pl-10 pr-3 py-2 border-0 focus:ring-0 focus:border-0"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Currency List */}
                    <div className="max-h-60 overflow-y-auto">
                      {filteredCurrencies.length > 0 ? (
                        filteredCurrencies.map((currency) => (
                          <button
                            key={currency.code}
                            type="button"
                            onClick={() => handleCurrencySelect(currency.code)}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3 ${
                              formData.currency === currency.code ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                          >
                            <span className="text-lg min-w-[20px]">{currency.symbol}</span>
                            <div className="flex-1">
                              <div className="font-medium">{currency.name}</div>
                              <div className="text-sm text-gray-500">{currency.code}</div>
                            </div>
                            {formData.currency === currency.code && (
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-gray-500">
                          No currencies found matching "{currencySearch}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500">
                Selected currency: {getCurrencySymbol(formData.currency)} {formData.currency}
              </p>
            </div>
          </CardContent>
        </Card>
        {/* API Keys Card */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Enter your Stripe API keys to enable payment processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Public Key */}
            <div className="space-y-2">
              <Label htmlFor="publicKey" className="text-sm font-medium">
                Public Key (Publishable Key)
                <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
              </Label>
              <div className="relative">
                <Input
                  id="publicKey"
                  value={formData.publicKey}
                  onChange={(e) => handleInputChange('publicKey', e.target.value)}
                  placeholder="pk_test_..."
                  className={`pr-10 ${errors.publicKey ? 'border-red-500' : ''}`}
                />
                {formData.publicKey && !errors.publicKey && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {errors.publicKey && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
              {errors.publicKey && (
                <p className="text-sm text-red-600">{errors.publicKey}</p>
              )}
              <p className="text-xs text-gray-500">
                Your publishable key starts with "pk_test_" for testing or "pk_live_" for production
              </p>
            </div>

            {/* Secret Key */}
            <div className="space-y-2">
              <Label htmlFor="secretKey" className="text-sm font-medium">
                Secret Key
                <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
              </Label>
              <div className="relative">
                <Input
                  id="secretKey"
                  type={showSecretKey ? 'text' : 'password'}
                  value={formData.secretKey}
                  onChange={(e) => handleInputChange('secretKey', e.target.value)}
                  placeholder="sk_test_..."
                  className={`pr-20 ${errors.secretKey ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                {formData.secretKey && !errors.secretKey && (
                  <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {errors.secretKey && (
                  <AlertCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
              {errors.secretKey && (
                <p className="text-sm text-red-600">{errors.secretKey}</p>
              )}
              <p className="text-xs text-gray-500">
                Your secret key starts with "sk_test_" for testing or "sk_live_" for production
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Messages */}
        {message && (
          <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={loading || !isValid}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={loadSettings}
            disabled={loading}
            size="lg"
          >
            Reload Settings
          </Button>
        </div>

        {/* Validation Status */}
        {Object.keys(touched).length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            {isValid ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600">All fields are valid</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-yellow-600">Please fix validation errors</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 