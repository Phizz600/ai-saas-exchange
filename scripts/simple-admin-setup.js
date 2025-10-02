import { createClient } from '@supabase/supabase-js';

// Supabase configuration - using anon key for direct database access
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdmin() {
  try {
    console.log('🔍 Setting up admin access...');
    
    // First, let's check if there are any existing admin users
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
        console.log(`  - User ID: ${admin.user_id}`);
      }
      console.log('\n🎉 Admin access is already set up!');
      console.log('📝 To add more admins, use the admin panel at /admin');
      return;
    }
    
    console.log('📋 No existing admin users found.');
    console.log('\n🔧 To set up admin access, you need to:');
    console.log('1. Create a user account first (sign up on the website)');
    console.log('2. Get the user ID from the database');
    console.log('3. Run this command with the user ID:');
    console.log('   node scripts/make-user-admin-by-id.js <USER_ID>');
    console.log('\n💡 Alternative: Use the Supabase dashboard to:');
    console.log('1. Go to Authentication > Users');
    console.log('2. Find your user and copy the ID');
    console.log('3. Go to Table Editor > user_roles');
    console.log('4. Insert: user_id = YOUR_USER_ID, role = admin');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

console.log('🚀 Admin Setup Helper...');
setupAdmin();
