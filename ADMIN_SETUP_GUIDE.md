# Admin Panel Setup Guide

## Overview
This guide explains how to set up admin access for selected accounts to manage listings and site administration.

## Admin System Architecture

### Database Schema
- **`user_roles` table**: Stores user roles with `app_role` enum (`admin`, `moderator`, `user`)
- **`profiles` table**: User profile information
- **Row Level Security (RLS)**: Protects admin-only data

### Access Control Flow
```
User Login → useAdminCheck() → Check user_roles table → Admin Panel Access
```

## Setting Up Admin Access

### Method 1: Using the Admin Panel (Recommended)

1. **Bootstrap First Admin** (if no admin exists):
   - Access `/admin` directly (may need database setup for first admin)
   - Go to "User Management" tab
   - Create new admin users with:
     - Email address
     - Secure password (8+ characters)
     - First name
   - System automatically assigns `admin` role

2. **Create Additional Admins**:
   - Login as existing admin
   - Navigate to Admin Panel → User Management
   - Use the form to create new admin users

### Method 2: Direct Database Setup

If you need to create the first admin user manually:

```sql
-- 1. First, create a user account through Supabase Auth
-- 2. Then assign admin role
INSERT INTO public.user_roles (user_id, role) 
VALUES ('USER_ID_FROM_AUTH', 'admin');
```

### Method 3: Using Edge Function

Call the `create-admin-user` edge function:

```javascript
const { data, error } = await supabase.functions.invoke('create-admin-user', {
  body: {
    email: 'admin@yourapp.com',
    password: 'secure_password_123',
    firstName: 'Admin Name'
  }
});
```

## Admin Panel Features

### 📊 Analytics Tab
- Site Performance metrics
- Transaction Analytics
- Escrow Process analytics
- User Behavior analytics
- Transaction History dashboard

### 📦 Product Listings Tab
- Review and approve product listings
- Filter by status (pending, approved, rejected)
- Manage listing details
- Send notifications to sellers
- **This is the main listing management interface**

### 📧 Email Testing Tab
- Test welcome emails
- Test auction result emails
- General email testing
- API key status monitoring

### 👥 User Management Tab
- Create new admin users
- Manage user roles and permissions
- User validation and security

### ⚙️ Settings Tab
- Application configuration
- Environment information
- System settings

## Security Features

### Access Control
- ✅ Role-based access control (RBAC)
- ✅ Admin authentication required
- ✅ Secure route protection (`/admin`)
- ✅ User permission validation
- ✅ Row Level Security (RLS) policies

### Database Security
- ✅ RLS policies protect admin data
- ✅ Admin-only functions for role management
- ✅ Audit logging for sensitive operations
- ✅ Secure admin user creation

## Navigation Access

### For Admin Users
- **Admin Panel link** appears in navigation dropdown (Settings icon)
- **Direct URL**: Navigate to `/admin`
- **Development access**: Development link on homepage (dev mode only)

### For Non-Admin Users
- No admin panel access
- Access denied with proper error messages
- Redirected to appropriate pages

## Creating Your First Admin

### Option A: Database Direct (Bootstrap)
1. Create user account through Supabase Auth
2. Get the user ID from auth.users table
3. Insert into user_roles table:
```sql
INSERT INTO public.user_roles (user_id, role) 
VALUES ('USER_ID_HERE', 'admin');
```

### Option B: Edge Function
```bash
curl -X POST 'https://pxadbwlidclnfoodjtpd.supabase.co/functions/v1/create-admin-user' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@yourapp.com",
    "password": "secure_password_123",
    "firstName": "Admin Name"
  }'
```

## Managing Listings

Once you have admin access:

1. **Navigate to Admin Panel** → Product Listings tab
2. **Review Pending Listings**: See all products awaiting approval
3. **Approve/Reject**: Use the action buttons to manage listings
4. **Filter by Status**: Use status filters to organize listings
5. **Send Notifications**: Notify sellers about listing status changes

## Troubleshooting

### Common Issues
1. **"Access Denied"**: User doesn't have admin role in user_roles table
2. **"Authentication Required"**: User not logged in
3. **"Failed to verify permissions"**: Database connection or RLS policy issues

### Solutions
1. Check user_roles table for admin role
2. Verify user is logged in
3. Check database connection and RLS policies

## Best Practices

### Security
- Use strong passwords for admin accounts
- Regularly audit admin access
- Monitor admin activity logs
- Limit admin access to trusted individuals

### Management
- Create admin accounts only when needed
- Use descriptive names for admin users
- Document admin responsibilities
- Regular backup of admin configurations

## Support

For technical issues:
1. Check browser console for errors
2. Verify database connection
3. Review RLS policies
4. Check user_roles table entries
