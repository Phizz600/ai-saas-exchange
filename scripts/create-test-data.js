import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4MDAsImV4cCI6MjA1MDU1MDgwMH0.8Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestData() {
  try {
    console.log('Creating test data...');

    // Create test products for the user
    const testProducts = [
      {
        id: 'test-product-1',
        title: 'AI Content Generator',
        description: 'An AI-powered content generation tool that creates high-quality articles, blog posts, and social media content.',
        price: 25000,
        status: 'active',
        seller_id: 'test-user-123',
        category: 'AI Tools',
        tech_stack: ['Python', 'OpenAI API', 'React'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'test-product-2',
        title: 'Smart Analytics Dashboard',
        description: 'A comprehensive analytics dashboard with AI-powered insights and real-time data visualization.',
        price: 45000,
        status: 'active',
        seller_id: 'test-user-123',
        category: 'Analytics',
        tech_stack: ['JavaScript', 'D3.js', 'Node.js'],
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'test-product-3',
        title: 'Customer Support Bot',
        description: 'An intelligent customer support chatbot that handles common queries and escalates complex issues.',
        price: 18000,
        status: 'draft',
        seller_id: 'test-user-123',
        category: 'Customer Service',
        tech_stack: ['Python', 'NLP', 'FastAPI'],
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Insert test products
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .upsert(testProducts, { onConflict: 'id' });

    if (productsError) {
      console.error('Error creating test products:', productsError);
    } else {
      console.log('✅ Test products created successfully');
    }

    // Create test liked products
    const testLikedProducts = [
      'liked-product-1',
      'liked-product-2', 
      'liked-product-3',
      'liked-product-4',
      'liked-product-5',
      'liked-product-6',
      'liked-product-7',
      'liked-product-8',
      'liked-product-9',
      'liked-product-10',
      'liked-product-11',
      'liked-product-12'
    ];

    // Update profile with liked products
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        liked_products: testLikedProducts,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'test-user-123');

    if (profileError) {
      console.error('Error updating profile with liked products:', profileError);
    } else {
      console.log('✅ Test liked products added successfully');
    }

    console.log('🎉 Test data creation completed!');
    console.log('📊 Summary:');
    console.log(`   - ${testProducts.length} test products created`);
    console.log(`   - ${testLikedProducts.length} liked products added`);
    console.log('   - Profile updated with test data');

  } catch (error) {
    console.error('Error creating test data:', error);
  }
}

// Run the script
createTestData();



