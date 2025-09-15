import { createClient } from '@supabase/supabase-js';

// Use the same values from .env file
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function confirmTestUser() {
  try {
    console.log('🔍 Attempting to sign in with test user...');
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'testuser123@gmail.com',
      password: 'testpassword123'
    });

    if (signInData.user && !signInError) {
      console.log('✅ Test user can sign in successfully!');
      console.log('User:', signInData.user.email);
      console.log('Email confirmed:', signInData.user.email_confirmed_at ? 'Yes' : 'No');
      console.log('User ID:', signInData.user.id);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.log('❌ Profile fetch error:', profileError);
      } else if (profile) {
        console.log('✅ Profile exists:', profile.full_name || 'No name set');
      } else {
        console.log('ℹ️  No profile found, will be created on first access');
      }
      
    } else {
      console.log('❌ Sign in failed:', signInError?.message);
      
      if (signInError?.message?.includes('Email not confirmed')) {
        console.log('📧 Email verification is required');
        console.log('💡 For testing, you can:');
        console.log('   1. Check the email inbox for testuser123@gmail.com');
        console.log('   2. Use the Supabase admin panel to manually confirm the email');
        console.log('   3. Or create a new user with a different email');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
confirmTestUser();
