# Quick Admin Setup Guide

## 🎯 Goal
Mark an existing user account as admin so they can access the admin panel to manage listings.

## 🚀 Method 1: Supabase Dashboard (Easiest)

### Step 1: Create a User Account
1. Go to your website and sign up for a new account
2. Verify the email and complete the signup process

### Step 2: Get User ID from Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Users**
4. Find your user account and copy the **User ID** (UUID format)

### Step 3: Add Admin Role
1. Go to **Table Editor** → **user_roles**
2. Click **Insert** → **Insert row**
3. Fill in:
   - `user_id`: Paste the User ID from Step 2
   - `role`: Select `admin` from dropdown
4. Click **Save**

### Step 4: Verify Access
1. Login to your website with the admin account
2. Look for "Admin Panel" in the navigation menu
3. Navigate to `/admin` to access the admin panel

## 🛠️ Method 2: SQL Script

### Step 1: Find Your User ID
Run this SQL in **SQL Editor**:
```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

### Step 2: Make User Admin
Replace `USER_ID_HERE` with your actual user ID:
```sql
INSERT INTO public.user_roles (user_id, role) 
VALUES ('USER_ID_HERE', 'admin');
```

### Step 3: Verify
```sql
SELECT 
    ur.user_id,
    ur.role,
    au.email
FROM user_roles ur
LEFT JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'admin';
```

## 🖥️ Method 3: Node.js Script

### Step 1: Get User ID
Use Method 1 or 2 to get your user ID.

### Step 2: Run Script
```bash
node scripts/make-user-admin-by-id.js YOUR_USER_ID
```

## ✅ Verification

Once you've set up admin access:

1. **Login** with the admin account
2. **Check Navigation** - You should see "Admin Panel" in the dropdown menu
3. **Access Admin Panel** - Go to `/admin`
4. **Test Features**:
   - Product Listings tab - Manage listings
   - User Management tab - Create more admin users
   - Analytics tab - View site metrics

## 🎉 What You Can Do as Admin

### 📦 Manage Listings
- Review pending product listings
- Approve or reject listings
- Send notifications to sellers
- Filter listings by status

### 👥 User Management
- Create additional admin users
- Manage user roles and permissions

### 📊 Analytics
- View site performance metrics
- Track transaction analytics
- Monitor user behavior

### 📧 Email Testing
- Test welcome emails
- Test auction result emails
- Verify email functionality

## 🔧 Creating Additional Admins

Once you have admin access:

1. Go to **Admin Panel** → **User Management**
2. Fill in the form:
   - Email address
   - Password (8+ characters)
   - First name
3. Click **Create Admin User**
4. The new admin can now access `/admin`

## 🚨 Troubleshooting

### "Access Denied" Error
- Check if user has `admin` role in `user_roles` table
- Verify user is logged in
- Check database connection

### "Authentication Required" Error
- User needs to be logged in
- Check if account exists in `auth.users`

### Admin Panel Not Showing
- Verify `user_roles` table has entry with `role = 'admin'`
- Check if user is logged in
- Clear browser cache and try again

## 📞 Support

If you encounter issues:
1. Check the `user_roles` table in Supabase
2. Verify the user ID is correct
3. Ensure the user is logged in
4. Check browser console for errors

## 🎯 Quick Checklist

- [ ] User account created and verified
- [ ] User ID obtained from Supabase Dashboard
- [ ] Admin role added to `user_roles` table
- [ ] User logged in to website
- [ ] "Admin Panel" appears in navigation
- [ ] Can access `/admin` successfully
- [ ] Can manage listings in Product Listings tab
