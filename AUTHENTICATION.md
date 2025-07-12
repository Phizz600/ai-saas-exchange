# Authentication System Documentation

## Overview

This authentication system is built with Supabase and React, providing a complete user authentication experience including signup, signin, email verification, password reset, and Google OAuth.

## Architecture

### Core Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Global authentication state management
   - Provides user, session, and loading states
   - Handles auth state changes and sign out

2. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
   - Route protection wrapper
   - Redirects unauthenticated users
   - Preserves intended destination

3. **AuthForm** (`src/components/auth/AuthForm.tsx`)
   - Main authentication form
   - Handles signup/signin toggle
   - Integrates password reset

4. **PasswordResetForm** (`src/components/auth/PasswordResetForm.tsx`)
   - Dedicated password reset flow
   - Email sending and confirmation

### Authentication Flow

#### Signup Flow
1. User fills out signup form
2. System checks if user already exists
3. If new user, creates account with Supabase
4. Creates user profile in database
5. Sends verification email
6. User verifies email via link
7. User can then sign in

#### Signin Flow
1. User enters email/password
2. System validates credentials
3. If email not verified, shows error
4. If valid, creates session and redirects

#### Password Reset Flow
1. User clicks "Forgot Password"
2. User enters email address
3. System sends reset email
4. User clicks link in email
5. User sets new password
6. User can sign in with new password

#### Email Verification Flow
1. User signs up
2. System sends verification email
3. User clicks verification link
4. System verifies token
5. User can now sign in

## Key Features

### ✅ Implemented Features

- [x] **User Registration** - Complete signup with validation
- [x] **User Login** - Email/password authentication
- [x] **Email Verification** - Required before first signin
- [x] **Password Reset** - Email-based password recovery
- [x] **Google OAuth** - Social login integration
- [x] **Session Management** - Automatic token refresh
- [x] **Route Protection** - Protected routes require auth
- [x] **User Profile Creation** - Automatic profile setup
- [x] **Error Handling** - Comprehensive error messages
- [x] **Loading States** - User feedback during operations
- [x] **Toast Notifications** - Success/error feedback
- [x] **Account Existence Detection** - Prevents duplicate accounts

### 🔧 Configuration

#### Supabase Setup
```typescript
// src/integrations/supabase/client.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
```

#### Email Templates
- **Verification Email**: Sent when user signs up
- **Password Reset Email**: Sent when user requests reset
- **Welcome Email**: Sent after successful verification

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

### Protected Route
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route 
  path="/protected" 
  element={
    <ProtectedRoute>
      <ProtectedComponent />
    </ProtectedRoute>
  } 
/>
```

### Require Authentication
```typescript
import { useAuthCheck } from '@/hooks/useAuthCheck';

function MyComponent() {
  const { requireAuth } = useAuthCheck();
  
  const handleAction = () => {
    requireAuth(() => {
      // This code only runs if user is authenticated
      console.log('User is authenticated');
    });
  };
}
```

## Testing

### Manual Testing Checklist

1. **Signup Flow**
   - [ ] Fill out signup form
   - [ ] Verify email validation
   - [ ] Check password requirements
   - [ ] Confirm account creation
   - [ ] Verify email sent
   - [ ] Click verification link
   - [ ] Confirm email verified

2. **Signin Flow**
   - [ ] Enter valid credentials
   - [ ] Test invalid credentials
   - [ ] Test unverified email
   - [ ] Verify successful login
   - [ ] Check session creation

3. **Password Reset**
   - [ ] Click "Forgot Password"
   - [ ] Enter email address
   - [ ] Verify reset email sent
   - [ ] Click reset link
   - [ ] Set new password
   - [ ] Sign in with new password

4. **Google OAuth**
   - [ ] Click Google sign in
   - [ ] Complete OAuth flow
   - [ ] Verify account creation
   - [ ] Check profile setup

5. **Route Protection**
   - [ ] Try accessing protected route while unauthenticated
   - [ ] Verify redirect to auth page
   - [ ] Sign in and verify access granted
   - [ ] Test sign out and route protection

### Test Page
Visit `/auth-test` for comprehensive testing interface.

## Troubleshooting

### Common Issues

#### 1. Email Verification Not Working
**Symptoms**: User can't sign in after signup
**Solutions**:
- Check Supabase email settings
- Verify email template configuration
- Check spam folder
- Ensure email service is active

#### 2. Password Reset Not Working
**Symptoms**: Reset emails not received
**Solutions**:
- Verify Supabase email service
- Check email template for password reset
- Ensure redirect URL is correct
- Check spam folder

#### 3. Google OAuth Issues
**Symptoms**: Google sign in fails
**Solutions**:
- Verify Google OAuth configuration in Supabase
- Check redirect URLs
- Ensure Google project settings are correct
- Clear browser cache

#### 4. Session Expiration
**Symptoms**: User logged out unexpectedly
**Solutions**:
- Check token refresh configuration
- Verify session timeout settings
- Ensure auto-refresh is enabled

#### 5. Profile Creation Fails
**Symptoms**: User created but profile missing
**Solutions**:
- Check database permissions
- Verify RLS policies
- Check profile table structure
- Review error logs

### Debug Information

#### Check Authentication Status
```typescript
const { user, session, loading } = useAuth();
console.log('Auth Status:', { user, session, loading });
```

#### Check Supabase Configuration
```typescript
import { supabase } from '@/integrations/supabase/client';
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data, error);
```

#### Test Email Verification
```typescript
const { error } = await supabase.auth.verifyOtp({
  token_hash: token,
  type: 'email_confirmation'
});
console.log('Verification Result:', error);
```

## Security Considerations

### Best Practices Implemented

1. **Password Requirements**
   - Minimum 6 characters
   - Server-side validation

2. **Email Verification**
   - Required before first signin
   - Secure token verification

3. **Session Management**
   - Automatic token refresh
   - Secure session storage

4. **Route Protection**
   - Client and server-side checks
   - Proper redirect handling

5. **Error Handling**
   - No sensitive information in errors
   - User-friendly error messages

### Security Checklist

- [x] Email verification required
- [x] Password reset via email only
- [x] Secure session management
- [x] Protected routes
- [x] Input validation
- [x] Error message sanitization
- [x] HTTPS enforcement
- [x] CSRF protection (via Supabase)

## Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=https://pxadbwlidclnfoodjtpd.supabase.co
VITE_SUPABASE_ANON_KEY=yeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0
```

### Supabase Settings
1. **Authentication Settings**
   - Enable email confirmation
   - Configure password reset
   - Set up Google OAuth
   - Configure redirect URLs

2. **Email Templates**
   - Verification email template
   - Password reset template
   - Welcome email template

3. **Database Policies**
   - Profiles table RLS policies
   - User data access controls

## Performance

### Optimizations

1. **Lazy Loading**
   - Authentication components loaded on demand
   - Route-based code splitting

2. **Caching**
   - Session data cached locally
   - User profile cached

3. **Error Boundaries**
   - Graceful error handling
   - User-friendly fallbacks

## Monitoring

### Key Metrics to Track

1. **Authentication Success Rate**
   - Signup success rate
   - Signin success rate
   - Email verification rate

2. **Error Rates**
   - Authentication errors
   - Email delivery failures
   - OAuth failures

3. **User Behavior**
   - Time to first signin
   - Password reset frequency
   - Session duration

### Logging

```typescript
// Add to authentication functions
console.log('Auth Event:', { event, userId, timestamp });
```

## Future Enhancements

### Planned Features

1. **Multi-Factor Authentication**
   - SMS verification
   - TOTP support

2. **Social Login Expansion**
   - GitHub OAuth
   - LinkedIn OAuth

3. **Advanced Security**
   - Device tracking
   - Suspicious activity detection

4. **User Management**
   - Admin user management
   - Bulk user operations

## Support

### Getting Help

1. **Check Documentation**
   - Review this file
   - Check Supabase docs

2. **Debug Steps**
   - Use `/auth-test` page
   - Check browser console
   - Review network requests

3. **Common Solutions**
   - Clear browser cache
   - Check email spam folder
   - Verify Supabase configuration

### Contact

For authentication issues:
1. Check the troubleshooting section above
2. Use the test page at `/auth-test`
3. Review browser console for errors
4. Check Supabase dashboard for configuration

---

**Last Updated**: December 2024
**Version**: 1.0.0