import { createClient } from '@supabase/supabase-js';

// Use the same values from .env file
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  try {
    console.log('🔍 Checking for existing test user...');
    
    // Try to sign in first to see if user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'testuser123@gmail.com',
      password: 'testpassword123'
    });

    if (signInData.user && !signInError) {
      console.log('✅ Test user already exists and can sign in');
      console.log('User:', signInData.user.email);
      console.log('Email confirmed:', signInData.user.email_confirmed_at ? 'Yes' : 'No');
      return;
    }

    console.log('📝 Creating new test user...');
    
    // Create new user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'testuser123@gmail.com',
      password: 'testpassword123'
    });

    if (signUpError) {
      console.error('❌ Sign up error:', signUpError);
      return;
    }

    if (signUpData.user) {
      console.log('✅ Test user created successfully');
      console.log('User ID:', signUpData.user.id);
      console.log('Email:', signUpData.user.email);
      console.log('Email confirmed:', signUpData.user.email_confirmed_at ? 'Yes' : 'No');
      
      if (!signUpData.user.email_confirmed_at) {
        console.log('⚠️  Email verification required');
        console.log('Check your email or use the admin panel to confirm the email');
      }
    } else {
      console.log('ℹ️  User creation completed but no user data returned');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
createTestUser();
