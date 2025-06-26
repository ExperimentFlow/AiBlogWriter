# Multi-Tenant Subdomain Platform

A modern, full-stack application that allows users to create custom subdomains with emojis. Built with Next.js 15, Prisma, PostgreSQL, and TypeScript.

## 🚀 Features

### Authentication
- **User Registration & Login**: Secure authentication with session management
- **Form Validation**: Zod schema validation with React Hook Form
- **Password Requirements**: Strong password validation with real-time feedback
- **Session Management**: Secure session tokens with automatic expiration

### Subdomain Management
- **Custom Subdomains**: Create unique subdomains with custom emojis
- **Database Storage**: All tenant data stored in PostgreSQL (no Redis dependency)
- **User Ownership**: Each subdomain is associated with a user account
- **Admin Dashboard**: Manage all subdomains with user information
- **Real-time Validation**: Check subdomain availability instantly

### User Experience
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Emoji Picker**: Intuitive emoji selection for subdomain branding
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Smooth user feedback during operations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom session-based auth with better-auth
- **Validation**: Zod schemas with React Hook Form
- **Deployment**: Ready for Vercel deployment

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd platforms
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your database URL:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/platforms"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and user management
- **Tenant**: Subdomain information and ownership
- **Session**: User session management
- **Account**: OAuth account connections (for future use)
- **Verification**: Email verification tokens

### Tenant Model
```prisma
model Tenant {
  id          String   @id @default(cuid())
  subdomain   String   @unique
  name        String?
  emoji       String
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 🔐 Authentication

### Features
- Email/password authentication
- Session-based auth with secure tokens
- Protected admin routes
- Form validation with Zod
- Password strength requirements

### Usage
1. **Sign Up**: Create a new account at `/auth/signup`
2. **Sign In**: Access your account at `/auth/signin`
3. **Admin Access**: Manage subdomains at `/admin`

## 🌐 Subdomain System

### Creating Subdomains
1. **Authentication Required**: Users must be logged in
2. **Unique Subdomains**: Each subdomain is globally unique
3. **Emoji Branding**: Custom emoji for visual identity
4. **Optional Metadata**: Name and description fields
5. **Automatic Redirect**: Redirects to subdomain after creation

### Subdomain Validation
- **Length**: 3-63 characters
- **Characters**: Lowercase letters, numbers, hyphens only
- **Reserved Words**: Common subdomains are blocked
- **Availability**: Real-time availability checking

### Accessing Subdomains
- **Format**: `subdomain.yourdomain.com`
- **Content**: Custom emoji, name, description, and creator info
- **Status**: Active/inactive status management

## 🎨 UI Components

### Form Components
- **FormField**: Reusable form input with error handling
- **Textarea**: Multi-line text input
- **EmojiPicker**: Custom emoji selection component

### Validation
- **Zod Schemas**: Type-safe validation
- **React Hook Form**: Efficient form state management
- **Real-time Feedback**: Instant validation feedback

## 📁 Project Structure

```
platforms/
├── app/
│   ├── actions.ts              # Server actions
│   ├── admin/                  # Admin dashboard
│   ├── api/                    # API routes
│   ├── auth/                   # Authentication pages
│   ├── s/[subdomain]/          # Subdomain pages
│   └── subdomain-form.tsx      # Subdomain creation form
├── components/
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── auth.ts                 # Authentication configuration
│   ├── auth-utils.ts           # Auth utilities
│   ├── tenants.ts              # Tenant management
│   ├── validations/            # Zod validation schemas
│   └── utils.ts                # Utility functions
└── prisma/
    └── schema.prisma           # Database schema
```

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add your `DATABASE_URL`
3. **Database**: Use Vercel Postgres or external PostgreSQL
4. **Deploy**: Automatic deployment on push to main branch

### Environment Variables
```env
DATABASE_URL="postgresql://..."
NODE_ENV="production"
```

## 🔧 Development

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `npx prisma studio` - Open database GUI
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db seed` - Seed database with sample data

### Database Management
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

## 🧪 Testing

### Test Users
The seed script creates test users:
- **Alice**: `alice@prisma.io`
- **Bob**: `bob@prisma.io`

### Manual Testing
1. **Authentication**: Test sign-up and sign-in flows
2. **Subdomain Creation**: Create subdomains with different names
3. **Admin Dashboard**: Manage subdomains and view user information
4. **Subdomain Access**: Visit created subdomains

## 🔒 Security Features

- **Input Validation**: Server-side and client-side validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Session Security**: Secure session tokens with expiration
- **Password Security**: Strong password requirements
- **CSRF Protection**: Form-based CSRF protection

## 🚧 Future Enhancements

- [ ] OAuth providers (Google, GitHub)
- [ ] Email verification
- [ ] Custom domain support
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Advanced tenant customization
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License.
