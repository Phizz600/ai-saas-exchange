# Authentication System Documentation

## Overview

This application uses Supabase for authentication with a comprehensive React-based authentication system. The system includes:

- **Global Authentication Context** - Manages authentication state across the app
- **Protected Routes** - Automatically redirects unauthenticated users
- **Authentication Hooks** - Easy-to-use hooks for auth checks
- **User Profile Management** - Handles user profiles and preferences

## Architecture

### Core Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Global authentication state management
   - Provides user, session, and loading states
   - Handles sign-out functionality
   - Listens to auth state changes

2. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
   - Wraps routes that require authentication
   - Automatically redirects unauthenticated users
   - Supports custom redirect paths and messages

3. **AuthStatus** (`src/components/AuthStatus.tsx`)
   - Visual component showing authentication status
   - Can display user details
   - Useful for debugging and user feedback

### Hooks

1. **useAuth** (`src/contexts/AuthContext.tsx`)
   ```typescript
   const { user, session, loading, signOut, refreshSession } = useAuth();
   ```

2. **useAuthCheck** (`src/hooks/useAuthCheck.ts`)
   ```typescript
   const { isAuthenticated, isUnauthenticated, requireAuth } = useAuthCheck({
     redirectTo: '/auth',
     showToast: true,
     message: 'Please sign in to access this feature'
   });
   ```

## Route Protection

### Public Routes
Routes that don't require authentication:
- `/` - Home page
- `/marketplace` - Product marketplace
- `/auth` - Authentication page
- `/about`, `/contact`, `/faq` - Static pages

### Protected Routes
Routes that require authentication:
- `/profile` - User profile
- `/product-dashboard` - Product management
- `/messages` - Messaging system
- `/settings` - User settings
- `/list-product` - Product listing form
- `/admin` - Admin panel

## Authentication Flow

1. **Initial Load**
   - App checks for existing session
   - Shows loading state while checking
   - Redirects to auth page if no session

2. **Sign In**
   - User fills out auth form
   - Supabase handles authentication
   - User is redirected to appropriate page based on profile

3. **Sign Out**
   - Clears session and user data
   - Redirects to home page
   - Shows success toast

4. **Route Protection**
   - Protected routes check authentication
   - Redirect to auth page if not authenticated
   - Preserve intended destination for post-login redirect

## Usage Examples

### Basic Authentication Check
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Welcome, {user.email}!</div>;
}
```

### Protected Component
```typescript
import { useAuthCheck } from '@/hooks/useAuthCheck';

function ProtectedComponent() {
  const { requireAuth } = useAuthCheck();
  
  const handleAction = () => {
    if (!requireAuth()) return; // Will redirect if not authenticated
    
    // Proceed with action
  };
  
  return <button onClick={handleAction}>Do Something</button>;
}
```

### Route Protection
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

// In routes configuration
{
  path: "/protected-page",
  element: (
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  ),
}
```

## Testing

Visit `/auth-test` to see a comprehensive authentication testing page that shows:
- Current authentication status
- User information
- Session details
- Authentication hook functionality

## Configuration

### Supabase Setup
The authentication system uses the Supabase client configured in `src/integrations/supabase/client.ts`:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
```

### Environment Variables
Ensure these environment variables are set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Security Features

1. **Session Persistence** - Sessions are automatically persisted
2. **Token Refresh** - Access tokens are automatically refreshed
3. **Route Protection** - Unauthenticated users can't access protected routes
4. **Redirect Preservation** - Users are redirected to their intended destination after login
5. **Toast Notifications** - User-friendly feedback for auth actions

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Supabase configuration
   - Verify environment variables
   - Check browser console for errors

2. **Redirect loops**
   - Ensure auth page is not protected
   - Check redirect logic in Auth component

3. **Session not persisting**
   - Check Supabase auth configuration
   - Verify localStorage is available

### Debug Tools

- Use `/auth-test` page for debugging
- Check browser console for auth logs
- Use React DevTools to inspect AuthContext state

## Future Enhancements

1. **Role-based Access Control** - Different permissions for different user types
2. **Multi-factor Authentication** - Additional security layers
3. **Social Login Providers** - More OAuth options
4. **Session Management** - Better session handling and timeout
5. **Offline Support** - Handle authentication when offline 