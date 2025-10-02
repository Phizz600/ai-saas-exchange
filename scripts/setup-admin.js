import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdmin() {
  try {
    console.log('🔍 Checking for existing users...');
    
    // Get all users from auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching users:', authError);
      return;
    }
    
    if (authUsers.users.length === 0) {
      console.log('❌ No users found. Please create a user account first.');
      return;
    }
    
    console.log('📋 Available users:');
    authUsers.users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (ID: ${user.id})`);
    });
    
    // Check if any user already has admin role
    console.log('\n🔍 Checking for existing admin users...');
    const { data: existingAdmins, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('role', 'admin');
    
    if (adminError) {
      console.error('❌ Error checking admin roles:', adminError);
      return;
    }
    
    if (existingAdmins && existingAdmins.length > 0) {
      console.log('✅ Found existing admin users:');
      for (const admin of existingAdmins) {
        const user = authUsers.users.find(u => u.id === admin.user_id);
        if (user) {
          console.log(`  - ${user.email} (ID: ${user.id})`);
        }
      }
      console.log('\n🎉 Admin access is already set up!');
      return;
    }
    
    // Make the first user an admin
    const firstUser = authUsers.users[0];
    console.log(`\n🔧 Making ${firstUser.email} an admin...`);
    
    const { data: roleData, error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: firstUser.id,
        role: 'admin'
      });
    
    if (insertError) {
      console.error('❌ Error adding admin role:', insertError);
      return;
    }
    
    console.log('✅ Successfully added admin role!');
    console.log(`🎉 User ${firstUser.email} can now access the admin panel at /admin`);
    console.log('\n📝 Next steps:');
    console.log('1. Login with the admin account');
    console.log('2. Navigate to /admin to access the admin panel');
    console.log('3. Use the User Management tab to create additional admin users');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

console.log('🚀 Setting up admin access...');
setupAdmin();
