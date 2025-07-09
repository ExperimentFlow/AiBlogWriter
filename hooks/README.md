# useUser Hook

A comprehensive React hook for managing user authentication and tenant information in a multi-tenant application.

## Features

- **User Authentication**: Login, logout, and registration
- **Session Management**: Automatic session validation and persistence
- **Tenant Information**: Access to tenant data and settings
- **Profile Updates**: Update user profile information
- **Role-based Access**: Helper functions for role checking
- **Error Handling**: Built-in error management
- **Loading States**: Loading indicators for async operations

## Installation

The hook is already included in the project. Make sure the `UserProvider` is wrapped around your app in `app/layout.tsx`.

## Usage

### Basic Usage

```tsx
import { useUserContext } from '../contexts/UserContext';

function MyComponent() {
  const {
    user,
    tenant,
    isAuthenticated,
    isLoading,
    login,
    logout,
  } = useUserContext();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Tenant: {tenant?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Login

```tsx
const { login } = useUserContext();

const handleLogin = async () => {
  const result = await login({
    email: 'user@example.com',
    password: 'password123',
    tenantId: 'optional-tenant-id'
  });

  if (result.success) {
    // Redirect or show success message
    console.log('Login successful:', result.data);
  } else {
    // Handle error
    console.error('Login failed:', result.error);
  }
};
```

### Registration

```tsx
const { register } = useUserContext();

const handleRegister = async () => {
  const result = await register({
    email: 'newuser@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    tenantId: 'optional-tenant-id'
  });

  if (result.success) {
    console.log('Registration successful:', result.data);
  } else {
    console.error('Registration failed:', result.error);
  }
};
```

### Update Profile

```tsx
const { updateUser } = useUserContext();

const handleUpdateProfile = async () => {
  const result = await updateUser({
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567890'
  });

  if (result.success) {
    console.log('Profile updated:', result.data);
  } else {
    console.error('Update failed:', result.error);
  }
};
```

## API Reference

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current user object |
| `tenant` | `Tenant \| null` | Current tenant object |
| `isAuthenticated` | `boolean` | Whether user is logged in |
| `isLoading` | `boolean` | Loading state for async operations |
| `error` | `string \| null` | Current error message |

### Actions

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `login` | `LoginCredentials` | `Promise<{success: boolean, data?: UserSession, error?: string}>` | Login user |
| `register` | `RegisterData` | `Promise<{success: boolean, data?: UserSession, error?: string}>` | Register new user |
| `logout` | - | `Promise<{success: boolean}>` | Logout user |
| `updateUser` | `Partial<User>` | `Promise<{success: boolean, data?: UserSession, error?: string}>` | Update user profile |
| `refreshSession` | - | `Promise<void>` | Refresh session data |
| `clearError` | - | `void` | Clear current error |

### Computed Values

| Property | Type | Description |
|----------|------|-------------|
| `isAdmin` | `boolean` | Whether user has admin role |
| `isManager` | `boolean` | Whether user has manager role |
| `isUser` | `boolean` | Whether user has user role |
| `fullName` | `string` | User's full name |
| `initials` | `string` | User's initials |

## Data Types

### User Interface

```tsx
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'manager';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Tenant Interface

```tsx
interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  domain?: string;
  logo?: string;
  favicon?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    colorScheme: 'light' | 'dark';
  };
  settings: {
    enableCheckout: boolean;
    enableAddons: boolean;
    enableCoupons: boolean;
    currency: string;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## Error Handling

The hook provides built-in error handling:

```tsx
const { error, clearError } = useUserContext();

// Display error
{error && (
  <div className="error-message">
    {error}
    <button onClick={clearError}>Dismiss</button>
  </div>
)}
```

## Session Persistence

The hook automatically:
- Stores session data in localStorage
- Validates sessions on app load
- Clears invalid sessions
- Refreshes session data when needed

## Integration with Checkout

The hook can be used in the checkout system to:
- Pre-fill customer information
- Apply tenant-specific settings
- Handle user-specific discounts
- Manage checkout permissions

Example in checkout:

```tsx
const { user, tenant } = useUserContext();

// Pre-fill customer info
const customerInfo = {
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  email: user?.email || '',
  phone: user?.phone || '',
};

// Apply tenant settings
const currency = tenant?.settings.currency || 'USD';
const enableAddons = tenant?.settings.enableAddons || false;
``` 