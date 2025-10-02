import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeUserAdmin(email) {
  try {
    console.log(`🔍 Looking for user with email: ${email}`);
    
    // First, let's check if the user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }
    
    const user = authUsers.users.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ User with email ${email} not found in auth.users`);
      console.log('Available users:');
      authUsers.users.forEach(u => console.log(`  - ${u.email} (ID: ${u.id})`));
      return;
    }
    
    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);
    
    // Check if user already has admin role
    const { data: existingRole, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    
    if (existingRole && !roleError) {
      console.log('✅ User already has admin role');
      return;
    }
    
    // Add admin role to user
    console.log('🔧 Adding admin role to user...');
    const { data: roleData, error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: 'admin'
      });
    
    if (insertError) {
      console.error('❌ Error adding admin role:', insertError);
      return;
    }
    
    console.log('✅ Successfully added admin role to user!');
    console.log(`🎉 User ${email} can now access the admin panel at /admin`);
    
    // Verify the role was added
    const { data: verifyRole, error: verifyError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    
    if (verifyRole && !verifyError) {
      console.log('✅ Verification successful - admin role confirmed');
    } else {
      console.log('⚠️  Warning: Could not verify admin role was added');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node make-user-admin.js <email>');
  console.log('Example: node make-user-admin.js admin@yourapp.com');
  process.exit(1);
}

console.log('🚀 Making user admin...');
makeUserAdmin(email);
