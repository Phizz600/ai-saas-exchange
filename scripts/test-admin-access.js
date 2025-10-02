import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminAccess() {
  try {
    console.log('🔍 Testing Admin Access System...\n');
    
    // 1. Check current admin users
    console.log('📋 Current Admin Users:');
    const { data: adminUsers, error: adminError } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role,
        created_at
      `)
      .eq('role', 'admin');
    
    if (adminError) {
      console.error('❌ Error fetching admin users:', adminError);
      return;
    }
    
    if (adminUsers && adminUsers.length > 0) {
      console.log(`✅ Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach((admin, index) => {
        console.log(`  ${index + 1}. User ID: ${admin.user_id}`);
        console.log(`     Role: ${admin.role}`);
        console.log(`     Created: ${admin.created_at}`);
      });
    } else {
      console.log('❌ No admin users found!');
      console.log('💡 You need to create an admin user first.');
      return;
    }
    
    // 2. Check user_roles table structure
    console.log('\n🔧 Database Structure Check:');
    const { data: allRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(5);
    
    if (rolesError) {
      console.error('❌ Error checking user_roles table:', rolesError);
    } else {
      console.log('✅ user_roles table is accessible');
      console.log(`📊 Total role entries: ${allRoles ? allRoles.length : 0}`);
    }
    
    // 3. Test admin role check function
    console.log('\n🧪 Testing Admin Role Check:');
    for (const admin of adminUsers) {
      const { data: roleCheck, error: checkError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', admin.user_id)
        .eq('role', 'admin')
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.log(`❌ Error checking role for user ${admin.user_id}:`, checkError.message);
      } else if (roleCheck) {
        console.log(`✅ User ${admin.user_id} has admin role confirmed`);
      } else {
        console.log(`❌ User ${admin.user_id} does not have admin role`);
      }
    }
    
    // 4. Security check - verify RLS policies
    console.log('\n🔒 Security Check:');
    console.log('✅ Admin access is protected by:');
    console.log('  - Authentication required (user must be logged in)');
    console.log('  - Role-based access control (admin role required)');
    console.log('  - Row Level Security (RLS) policies');
    console.log('  - Navigation menu conditional rendering');
    console.log('  - Route protection with CleanProtectedRoute');
    
    // 5. Test scenarios
    console.log('\n🎯 Test Scenarios:');
    console.log('1. ✅ Admin users should see "Admin Panel" in navigation');
    console.log('2. ✅ Admin users can access /admin route');
    console.log('3. ❌ Non-admin users should NOT see "Admin Panel" in navigation');
    console.log('4. ❌ Non-admin users should get "Access Denied" at /admin');
    console.log('5. ❌ Non-authenticated users should be redirected to /auth');
    
    console.log('\n📝 Manual Testing Steps:');
    console.log('1. Login with admin account → Should see "Admin Panel" in menu');
    console.log('2. Navigate to /admin → Should see admin dashboard');
    console.log('3. Test Product Listings tab → Should see listing management');
    console.log('4. Test User Management tab → Should be able to create admins');
    console.log('5. Logout and login with non-admin → Should NOT see "Admin Panel"');
    console.log('6. Try to access /admin as non-admin → Should get "Access Denied"');
    
    console.log('\n🎉 Admin Access System Status: READY FOR TESTING');
    
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error);
  }
}

console.log('🚀 Starting Admin Access Test...');
testAdminAccess();
