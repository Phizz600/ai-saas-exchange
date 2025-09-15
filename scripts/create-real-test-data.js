import { createClient } from '@supabase/supabase-js';

// Use the same values from .env file
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createRealTestData() {
  try {
    console.log('🔍 Creating real test data for dynamic profile...');

    // First, let's sign in to get the test user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'testuser123@gmail.com',
      password: 'testpassword123'
    });

    if (signInError) {
      console.error('❌ Cannot sign in:', signInError.message);
      console.log('💡 Make sure to verify the email first or create a new user');
      return;
    }

    const userId = signInData.user.id;
    console.log('✅ Signed in as:', signInData.user.email);

    // Create some test products for the user
    const testProducts = [
      {
        id: `product-${Date.now()}-1`,
        title: 'AI Content Generator Pro',
        description: 'Advanced AI-powered content generation tool that creates high-quality articles, blog posts, and social media content with SEO optimization.',
        price: 25000,
        status: 'active',
        seller_id: userId,
        category: 'AI Tools',
        tech_stack: ['Python', 'OpenAI API', 'React', 'Node.js'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `product-${Date.now()}-2`,
        title: 'Smart Analytics Dashboard',
        description: 'A comprehensive analytics dashboard with AI-powered insights, real-time data visualization, and custom reporting features.',
        price: 45000,
        status: 'active',
        seller_id: userId,
        category: 'Analytics',
        tech_stack: ['JavaScript', 'D3.js', 'Node.js', 'PostgreSQL'],
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `product-${Date.now()}-3`,
        title: 'Customer Support Bot',
        description: 'An intelligent customer support chatbot that handles common queries, escalates complex issues, and integrates with popular CRM systems.',
        price: 18000,
        status: 'draft',
        seller_id: userId,
        category: 'Customer Service',
        tech_stack: ['Python', 'NLP', 'FastAPI', 'MongoDB'],
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Insert test products
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .upsert(testProducts, { onConflict: 'id' });

    if (productsError) {
      console.error('❌ Error creating test products:', productsError);
    } else {
      console.log('✅ Test products created successfully');
      console.log(`   - ${testProducts.length} products added`);
    }

    // Create some products for the user to like
    const likedProducts = [
      {
        id: `liked-product-${Date.now()}-1`,
        title: 'ML Prediction Engine',
        description: 'Machine learning prediction engine for business forecasting and analytics.',
        price: 35000,
        status: 'active',
        seller_id: 'other-user-1',
        category: 'Machine Learning',
        tech_stack: ['Python', 'TensorFlow', 'Docker'],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `liked-product-${Date.now()}-2`,
        title: 'Automated Testing Suite',
        description: 'Comprehensive automated testing suite for web applications with CI/CD integration.',
        price: 22000,
        status: 'active',
        seller_id: 'other-user-2',
        category: 'Testing',
        tech_stack: ['JavaScript', 'Selenium', 'Jest'],
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `liked-product-${Date.now()}-3`,
        title: 'Data Visualization Tool',
        description: 'Interactive data visualization tool with real-time updates and custom dashboards.',
        price: 28000,
        status: 'active',
        seller_id: 'other-user-3',
        category: 'Data Visualization',
        tech_stack: ['React', 'D3.js', 'Python'],
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Insert liked products
    const { data: likedData, error: likedError } = await supabase
      .from('products')
      .upsert(likedProducts, { onConflict: 'id' });

    if (likedError) {
      console.error('❌ Error creating liked products:', likedError);
    } else {
      console.log('✅ Liked products created successfully');
      console.log(`   - ${likedProducts.length} products added`);
    }

    // Update user profile with liked products
    const likedProductIds = likedProducts.map(p => p.id);
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        liked_products: likedProductIds,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) {
      console.error('❌ Error updating profile with liked products:', profileError);
    } else {
      console.log('✅ Profile updated with liked products');
      console.log(`   - ${likedProductIds.length} liked products added to profile`);
    }

    console.log('\n🎉 Real test data creation completed!');
    console.log('📊 Summary:');
    console.log(`   - User: ${signInData.user.email}`);
    console.log(`   - User ID: ${userId}`);
    console.log(`   - ${testProducts.length} user products created`);
    console.log(`   - ${likedProducts.length} liked products created`);
    console.log(`   - Profile updated with liked products`);
    console.log('\n💡 Now you can test the profile page with real dynamic data!');

  } catch (error) {
    console.error('❌ Error creating real test data:', error);
  }
}

// Run the script
createRealTestData();
