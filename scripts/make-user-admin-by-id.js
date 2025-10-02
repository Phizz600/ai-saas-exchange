import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeUserAdminById(userId) {
  try {
    console.log(`🔍 Making user ${userId} an admin...`);
    
    // Check if user already has admin role
    const { data: existingRole, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
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
        user_id: userId,
        role: 'admin'
      });
    
    if (insertError) {
      console.error('❌ Error adding admin role:', insertError);
      return;
    }
    
    console.log('✅ Successfully added admin role to user!');
    console.log(`🎉 User ${userId} can now access the admin panel at /admin`);
    
    // Verify the role was added
    const { data: verifyRole, error: verifyError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
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

// Get user ID from command line argument
const userId = process.argv[2];

if (!userId) {
  console.log('Usage: node make-user-admin-by-id.js <USER_ID>');
  console.log('Example: node make-user-admin-by-id.js 12345678-1234-1234-1234-123456789012');
  console.log('\nTo get a user ID:');
  console.log('1. Go to Supabase Dashboard > Authentication > Users');
  console.log('2. Find your user and copy the ID');
  process.exit(1);
}

console.log('🚀 Making user admin...');
makeUserAdminById(userId);
