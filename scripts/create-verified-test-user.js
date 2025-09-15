import { createClient } from '@supabase/supabase-js';

// Use the same values from .env file
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createVerifiedTestUser() {
  try {
    console.log('🔍 Creating a new test user for immediate testing...');
    
    // Create a new user with a unique email
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@gmail.com`;
    const testPassword = 'testpassword123';
    
    console.log(`📧 Creating user with email: ${testEmail}`);
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.error('❌ Sign up error:', error);
      return;
    }

    if (data.user) {
      console.log('✅ Test user created successfully');
      console.log('User ID:', data.user.id);
      console.log('Email:', data.user.email);
      console.log('Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
      
      // Create some test products for this user
      const testProducts = [
        {
          id: `product-${timestamp}-1`,
          title: 'AI Content Generator Pro',
          description: 'Advanced AI-powered content generation tool that creates high-quality articles, blog posts, and social media content with SEO optimization.',
          price: 25000,
          status: 'active',
          seller_id: data.user.id,
          category: 'AI Tools',
          tech_stack: ['Python', 'OpenAI API', 'React', 'Node.js'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: `product-${timestamp}-2`,
          title: 'Smart Analytics Dashboard',
          description: 'A comprehensive analytics dashboard with AI-powered insights, real-time data visualization, and custom reporting features.',
          price: 45000,
          status: 'active',
          seller_id: data.user.id,
          category: 'Analytics',
          tech_stack: ['JavaScript', 'D3.js', 'Node.js', 'PostgreSQL'],
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: `product-${timestamp}-3`,
          title: 'Customer Support Bot',
          description: 'An intelligent customer support chatbot that handles common queries, escalates complex issues, and integrates with popular CRM systems.',
          price: 18000,
          status: 'draft',
          seller_id: data.user.id,
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
          id: `liked-product-${timestamp}-1`,
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
          id: `liked-product-${timestamp}-2`,
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
          id: `liked-product-${timestamp}-3`,
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
        .eq('id', data.user.id);

      if (profileError) {
        console.error('❌ Error updating profile with liked products:', profileError);
      } else {
        console.log('✅ Profile updated with liked products');
        console.log(`   - ${likedProductIds.length} liked products added to profile`);
      }

      console.log('\n🎉 Verified test user and data creation completed!');
      console.log('📊 Summary:');
      console.log(`   - Email: ${testEmail}`);
      console.log(`   - Password: ${testPassword}`);
      console.log(`   - User ID: ${data.user.id}`);
      console.log(`   - ${testProducts.length} user products created`);
      console.log(`   - ${likedProducts.length} liked products created`);
      console.log(`   - Profile updated with liked products`);
      console.log('\n💡 You can now use these credentials to test the profile page!');
      console.log('⚠️  Note: Email verification may still be required depending on Supabase settings');
      
    } else {
      console.log('ℹ️  User creation completed but no user data returned');
    }

  } catch (error) {
    console.error('❌ Error creating verified test user:', error);
  }
}

// Run the script
createVerifiedTestUser();
