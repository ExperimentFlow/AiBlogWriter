'use client'
import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export const UserProfile: React.FC = () => {
  const {
    user,
    tenant,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    clearError,
    fullName,
    initials,
    isAdmin,
  } = useUserContext();

  const [loginForm, setLoginForm] = React.useState({
    email: '',
    password: '',
  });

  const [updateForm, setUpdateForm] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(loginForm);
    if (result.success) {
      setLoginForm({ email: '', password: '' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateUser(updateForm);
    if (result.success) {
      setUpdateForm({ firstName: '', lastName: '', phone: '' });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="ml-2"
              >
                ×
              </Button>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{fullName}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">
                Role: {user?.role} {isAdmin && '(Admin)'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="ml-2"
              >
                ×
              </Button>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={updateForm.firstName}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, firstName: e.target.value })
                  }
                  placeholder={user?.firstName}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={updateForm.lastName}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, lastName: e.target.value })
                  }
                  placeholder={user?.lastName}
                />
              </div>
            </div>
           
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {tenant && (
        <Card>
          <CardHeader>
            <CardTitle>Tenant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {tenant.name}</p>
              <p><strong>Subdomain:</strong> {tenant.subdomain}</p>
              {tenant.domain && <p><strong>Domain:</strong> {tenant.domain}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <Button onClick={logout} variant="outline" className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}; 