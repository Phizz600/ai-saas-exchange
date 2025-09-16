import { createClient } from '@supabase/supabase-js';

// Use the same values from .env file
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBasicFunctionality() {
  try {
    console.log('🧪 Testing basic Supabase functionality...\n');

    // Test 1: Database connection
    console.log('1️⃣ Testing database connection...');
    const { data: dbTest, error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      return;
    }
    console.log('✅ Database connection successful');

    // Test 2: Auth connection
    console.log('\n2️⃣ Testing auth connection...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth connection failed:', authError.message);
      return;
    }
    console.log('✅ Auth connection successful');
    console.log('   Current session:', session ? 'Active' : 'None');

    // Test 3: Try to create a new test user
    console.log('\n3️⃣ Testing user creation...');
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@example.com`;
    const testPassword = 'testpassword123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signUpError) {
      console.error('❌ User creation failed:', signUpError.message);
      console.log('   This might be due to email verification requirements');
    } else {
      console.log('✅ User creation successful');
      console.log('   Email:', signUpData.user?.email);
      console.log('   Email confirmed:', signUpData.user?.email_confirmed_at ? 'Yes' : 'No');
    }

    // Test 4: Check if we can fetch products
    console.log('\n4️⃣ Testing products table access...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, price')
      .limit(3);

    if (productsError) {
      console.error('❌ Products fetch failed:', productsError.message);
    } else {
      console.log('✅ Products table accessible');
      console.log(`   Found ${products?.length || 0} products`);
      if (products && products.length > 0) {
        console.log('   Sample product:', products[0].title);
      }
    }

    // Test 5: Check profiles table
    console.log('\n5️⃣ Testing profiles table access...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, user_type')
      .limit(3);

    if (profilesError) {
      console.error('❌ Profiles fetch failed:', profilesError.message);
    } else {
      console.log('✅ Profiles table accessible');
      console.log(`   Found ${profiles?.length || 0} profiles`);
      if (profiles && profiles.length > 0) {
        console.log('   Sample profile:', profiles[0].full_name || 'No name');
      }
    }

    console.log('\n🎉 Basic functionality test completed!');
    console.log('\n📋 Summary:');
    console.log('   - Database connection: ✅ Working');
    console.log('   - Auth connection: ✅ Working');
    console.log('   - User creation: ' + (signUpError ? '❌ Requires email verification' : '✅ Working'));
    console.log('   - Products table: ' + (productsError ? '❌ Error' : '✅ Working'));
    console.log('   - Profiles table: ' + (profilesError ? '❌ Error' : '✅ Working'));

    if (signUpError && signUpError.message.includes('Email not confirmed')) {
      console.log('\n💡 Note: Email verification is required for new users');
      console.log('   This is a security feature, not a bug');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testBasicFunctionality();
