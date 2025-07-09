# User Role System

This platform implements a role-based user system to distinguish between different types of users based on where they create their accounts.

## User Roles

### Owner Role
- **Default role**: `owner`
- **Access**: Full admin access to the platform
- **Creation**: Users who sign up from the root application (main domain)
- **Permissions**:
  - Access to admin dashboard
  - Create and manage tenants
  - Manage all blog posts and categories
  - Access to all platform features

### User Role
- **Default role**: `user`
- **Access**: Limited access, primarily for tenant site interactions
- **Creation**: Users who sign up from tenant subdomains
- **Permissions**:
  - Access to tenant-specific content
  - Limited to tenant site features
  - Cannot access admin dashboard

## Implementation Details

### Database Schema
The `User` model includes a `role` field:
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?
  role          String    @default("user") // "owner" or "user"
  // ... other fields
}
```

### Role Assignment Logic

#### Automatic Role Detection
The signup API automatically detects the user's role based on the request origin:

1. **Tenant Site Signup**: If the request comes from a subdomain (e.g., `blog.example.com`), the user gets the `user` role
2. **Root Application Signup**: If the request comes from the main domain (e.g., `example.com`), the user gets the `owner` role

#### Manual Role Assignment
You can also explicitly set the role during signup by including the `role` field in the request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // or "owner"
}
```

### API Endpoints

#### Signup API
- **Endpoint**: `POST /api/auth/signup`
- **Automatic Role Detection**: Based on request origin
- **Manual Role Override**: Accepts `role` field in request body

### Components

#### TenantSignupForm
A specialized signup form for tenant sites that:
- Automatically sets the role to `user`
- Provides tenant-specific branding
- Redirects back to the tenant site after successful signup

#### Usage Example
```tsx
import { TenantSignupForm } from '@/components/tenant-signup-form';

<TenantSignupForm 
  tenantName="My Blog" 
  tenantSubdomain="myblog"
/>
```

### Access Control

#### Role Utilities
The `lib/role-utils.ts` file provides utility functions for role-based access control:

```typescript
import { isOwner, isUser, canAccessAdmin } from '@/lib/role-utils';

// Check if user is an owner
if (isOwner(user)) {
  // Grant admin access
}

// Check if user can access admin panel
if (canAccessAdmin(user)) {
  // Allow admin access
}
```

#### Admin Access Protection
The admin layout automatically checks for owner role:
```typescript
// In app/admin/layout.tsx
if (!canAccessAdmin(user)) {
  redirect('/'); // Redirect non-owners to home page
}
```

## Usage Examples

### Creating a User from Root Application
```typescript
// This will create a user with "owner" role
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123'
  })
});
```

### Creating a User from Tenant Site
```typescript
// This will create a user with "user" role
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user' // Explicitly set role
  })
});
```

### Checking User Role in Components
```typescript
import { getCurrentUser } from '@/lib/auth-utils';
import { isOwner } from '@/lib/role-utils';

const user = await getCurrentUser();

if (isOwner(user)) {
  // Show admin features
} else {
  // Show user features
}
```

## Security Considerations

1. **Role Validation**: Always validate user roles on both client and server side
2. **Access Control**: Use role utilities to check permissions before granting access
3. **API Protection**: Protect admin APIs by checking for owner role
4. **Session Management**: Include role information in user sessions

## Migration

If you're adding this to an existing application:

1. Run the migration to add the role field:
   ```bash
   npx prisma migrate dev --name add_user_role
   ```

2. Update existing users to have appropriate roles:
   ```sql
   -- Set all existing users as owners (adjust as needed)
   UPDATE "user" SET role = 'owner' WHERE role IS NULL;
   ```

3. Update your authentication utilities to include role information
4. Add role-based access control to your admin routes 