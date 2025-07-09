"use client";
import React from 'react';
import { useUserContext } from '../../contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';

export default function AuthFlowDemoPage() {
  const {
    user,
    tenant,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshSession,
    clearError,
    fullName,
    initials,
  } = useUserContext();
  const router = useRouter();

  const handleQuickLogin = async () => {
    const result = await login({
      email: 'demo@example.com',
      password: 'DemoPass123',
    });
    
    if (result.success) {
      console.log('Login successful:', result.data);
    } else {
      console.error('Login failed:', result.error);
    }
  };

  const handleQuickRegister = async () => {
    const result = await register({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      password: 'DemoPass123',
      confirmPassword: 'DemoPass123',
    });
    
    if (result.success) {
      console.log('Registration successful:', result.data);
    } else {
      console.error('Registration failed:', result.error);
    }
  };

  const handleRefreshSession = async () => {
    const result = await refreshSession();
    if (result.success) {
      console.log('Session refreshed:', result.data);
    } else {
      console.error('Session refresh failed:', result.error);
    }
  };

  const handleNavigateToDashboard = () => {
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication Flow Demo
          </h1>
          <p className="text-gray-600">
            This page demonstrates the complete authentication flow with user context updates.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-red-700">{error}</p>
                <Button variant="ghost" size="sm" onClick={clearError}>
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Authentication Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
              {isAuthenticated && user && (
                <>
                  <p><strong>User:</strong> {fullName} ({user.email})</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Initials:</strong> {initials}</p>
                </>
              )}
              {isAuthenticated && tenant && (
                <>
                  <p><strong>Tenant:</strong> {tenant.name}</p>
                  <p><strong>Subdomain:</strong> {tenant.subdomain}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {!isAuthenticated ? (
                <>
                  <Button onClick={handleQuickLogin} variant="default">
                    Quick Login
                  </Button>
                  <Button onClick={handleQuickRegister} variant="outline">
                    Quick Register
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleRefreshSession} variant="outline">
                    Refresh Session
                  </Button>
                  <Button onClick={handleNavigateToDashboard} variant="default">
                    Navigate to Dashboard
                  </Button>
                  <Button onClick={logout} variant="destructive">
                    Logout
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Data Display */}
        {isAuthenticated && user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Tenant Data Display */}
        {isAuthenticated && tenant && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tenant Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(tenant, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>1. <strong>Registration:</strong> Click "Quick Register" to create a new account</p>
              <p>2. <strong>Onboarding:</strong> After registration, you'll be redirected to onboarding</p>
              <p>3. <strong>Tenant Creation:</strong> Complete onboarding to create your tenant</p>
              <p>4. <strong>Context Update:</strong> Tenant data will be automatically saved to context</p>
              <p>5. <strong>Session Refresh:</strong> Use "Refresh Session" to update context data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 