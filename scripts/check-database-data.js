import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseData() {
  try {
    console.log('🔍 Checking database data...\n');

    // Check profiles
    console.log('📊 PROFILES:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
    } else {
      console.log(`✅ Found ${profiles.length} profiles:`);
      profiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.full_name || 'No name'} (${profile.id})`);
        console.log(`      - Username: ${profile.username || 'Not set'}`);
        console.log(`      - User Type: ${profile.user_type || 'Not set'}`);
        console.log(`      - Bio: ${profile.bio ? 'Set' : 'Not set'}`);
        console.log(`      - Avatar: ${profile.avatar_url ? 'Set' : 'Not set'}`);
        console.log(`      - Liked Products: ${profile.liked_products?.length || 0}`);
        console.log('');
      });
    }

    // Check products
    console.log('📦 PRODUCTS:');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, price, status, seller_id, created_at')
      .limit(10);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
    } else {
      console.log(`✅ Found ${products.length} products:`);
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title}`);
        console.log(`      - Price: $${product.price?.toLocaleString() || 'Not set'}`);
        console.log(`      - Status: ${product.status || 'Not set'}`);
        console.log(`      - Seller: ${product.seller_id}`);
        console.log(`      - Created: ${product.created_at}`);
        console.log('');
      });
    }

    // Check auth users (if we have access)
    console.log('👤 AUTH USERS:');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️  No authenticated user (this is expected for this script)');
    } else if (user) {
      console.log(`✅ Authenticated user: ${user.email}`);
    } else {
      console.log('ℹ️  No authenticated user');
    }

    console.log('\n🎯 SUMMARY:');
    console.log(`   - Profiles: ${profiles?.length || 0}`);
    console.log(`   - Products: ${products?.length || 0}`);
    console.log(`   - Database connection: ✅ Working`);

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

// Run the check
checkDatabaseData();
