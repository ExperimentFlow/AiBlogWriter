# Authentication Setup

This project now includes a basic authentication system with the following features:

## Database Schema

The Prisma schema has been updated with proper authentication models:

- **User**: Stores user information (id, email, name, etc.)
- **Session**: Manages user sessions with tokens
- **Account**: OAuth account connections (for future OAuth providers)
- **Verification**: Email verification tokens

## Key Changes Made

### 1. Schema Fixes
- Fixed type mismatches (String IDs instead of Int)
- Added proper default values for timestamps
- Added unique constraints for security
- Added proper foreign key relationships with cascade deletes

### 2. Authentication Files Created
- `lib/auth.ts` - Better-auth configuration
- `lib/auth-utils.ts` - Custom authentication utilities
- `app/api/auth/signin/route.ts` - Sign-in API endpoint
- `app/api/auth/signout/route.ts` - Sign-out API endpoint
- `app/auth/signin/page.tsx` - Sign-in page
- `app/auth/signup/page.tsx` - Sign-up page
- `app/auth/signin/signin-form.tsx` - Client-side sign-in form

### 3. Admin Page Protection
- Added authentication check to `/admin` page
- Redirects unauthenticated users to sign-in page
- Shows user information and sign-out button

## How to Use

### 1. Sign In
1. Navigate to `/auth/signin`
2. Enter your email and password
3. You'll be redirected to the admin dashboard if successful

### 2. Access Admin Dashboard
1. Go to `/admin`
2. If not authenticated, you'll be redirected to sign-in
3. Once authenticated, you can access the dashboard

### 3. Sign Out
1. Click the "Sign out" button in the admin dashboard
2. You'll be logged out and redirected

## Environment Variables

Add these to your `.env` file for full authentication features:

```env
# Database
DATABASE_URL="postgresql://..."

# Email (for email authentication)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@example.com"

# OAuth Providers (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Security Notes

⚠️ **Important**: The current implementation is basic and should be enhanced for production:

1. **Password Hashing**: Implement proper password hashing (bcrypt, Argon2)
2. **Rate Limiting**: Add rate limiting to prevent brute force attacks
3. **CSRF Protection**: Add CSRF tokens to forms
4. **Input Validation**: Add proper input validation and sanitization
5. **Session Security**: Implement session rotation and proper session management
6. **OAuth**: Add OAuth providers for better security

## Database Migration

The schema has been migrated and seeded. If you need to reset:

```bash
npx prisma migrate reset
npx prisma db seed
```

## Testing

You can test the authentication with the seeded users:
- Email: `alice@prisma.io`
- Email: `bob@prisma.io`

Note: Currently, any password will work (as password hashing is not implemented yet). 