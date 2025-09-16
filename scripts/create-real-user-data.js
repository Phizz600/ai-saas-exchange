import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Use the same values from .env file
const supabaseUrl = 'https://pxadbwlidclnfoodjtpd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWRid2xpZGNsbmZvb2RqdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTc3ODksImV4cCI6MjA1MjkzMzc4OX0.CmmgdPEsVLlbmz0W3dqox505pVMO8lqxFlul2yp84i0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createRealUserData() {
  try {
    console.log('🔍 Creating real user data for authenticated users...');
    
    // First, let's try to sign in with the test user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'testuser1757920783862@gmail.com',
      password: 'testpassword123'
    });

    if (signInError) {
      console.error('❌ Cannot sign in:', signInError.message);
      console.log('💡 Please verify the email first or create a new user');
      return;
    }

    const userId = signInData.user.id;
    console.log('✅ Signed in as:', signInData.user.email);

    // Create realistic products for this user
    const userProducts = [
      {
        id: randomUUID(),
        title: 'AI Content Generator Pro',
        description: 'Advanced AI-powered content generation tool that creates high-quality articles, blog posts, and social media content with SEO optimization. Features include multi-language support, tone adjustment, and plagiarism detection.',
        price: 25000,
        status: 'active',
        seller_id: userId,
        category: 'AI Tools',
        tech_stack: ['Python', 'OpenAI API', 'React', 'Node.js', 'PostgreSQL'],
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        views: 156,
        likes: 23
      },
      {
        id: randomUUID(),
        title: 'Smart Analytics Dashboard',
        description: 'A comprehensive analytics dashboard with AI-powered insights, real-time data visualization, and custom reporting features. Integrates with multiple data sources and provides predictive analytics.',
        price: 45000,
        status: 'active',
        seller_id: userId,
        category: 'Analytics',
        tech_stack: ['JavaScript', 'D3.js', 'Node.js', 'PostgreSQL', 'Redis'],
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        views: 89,
        likes: 12
      },
      {
        id: randomUUID(),
        title: 'Customer Support Bot',
        description: 'An intelligent customer support chatbot that handles common queries, escalates complex issues, and integrates with popular CRM systems. Features natural language processing and sentiment analysis.',
        price: 18000,
        status: 'draft',
        seller_id: userId,
        category: 'Customer Service',
        tech_stack: ['Python', 'NLP', 'FastAPI', 'MongoDB', 'Docker'],
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        views: 34,
        likes: 5
      },
      {
        id: randomUUID(),
        title: 'E-commerce Automation Suite',
        description: 'Complete automation suite for e-commerce businesses including inventory management, order processing, customer communication, and analytics. Reduces manual work by 80%.',
        price: 35000,
        status: 'active',
        seller_id: userId,
        category: 'E-commerce',
        tech_stack: ['Python', 'Django', 'React', 'PostgreSQL', 'Celery'],
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        views: 78,
        likes: 15
      }
    ];

    // Create products from other users that this user has liked
    const likedProducts = [
      {
        id: randomUUID(),
        title: 'ML Prediction Engine',
        description: 'Machine learning prediction engine for business forecasting and analytics. Uses advanced algorithms to predict market trends and customer behavior.',
        price: 35000,
        status: 'active',
        seller_id: randomUUID(), // Different seller
        category: 'Machine Learning',
        tech_stack: ['Python', 'TensorFlow', 'Docker', 'Kubernetes'],
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        views: 234,
        likes: 45
      },
      {
        id: randomUUID(),
        title: 'Automated Testing Suite',
        description: 'Comprehensive automated testing suite for web applications with CI/CD integration. Supports multiple testing frameworks and provides detailed reporting.',
        price: 22000,
        status: 'active',
        seller_id: randomUUID(), // Different seller
        category: 'Testing',
        tech_stack: ['JavaScript', 'Selenium', 'Jest', 'Docker'],
        created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        views: 167,
        likes: 28
      },
      {
        id: randomUUID(),
        title: 'Data Visualization Tool',
        description: 'Interactive data visualization tool with real-time updates and custom dashboards. Supports multiple chart types and data sources.',
        price: 28000,
        status: 'active',
        seller_id: randomUUID(), // Different seller
        category: 'Data Visualization',
        tech_stack: ['React', 'D3.js', 'Python', 'FastAPI'],
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        views: 145,
        likes: 32
      },
      {
        id: randomUUID(),
        title: 'Blockchain Integration API',
        description: 'RESTful API for blockchain integration supporting multiple cryptocurrencies and smart contracts. Provides secure transaction processing and wallet management.',
        price: 50000,
        status: 'active',
        seller_id: randomUUID(), // Different seller
        category: 'Blockchain',
        tech_stack: ['Node.js', 'Ethereum', 'Web3', 'PostgreSQL'],
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        views: 198,
        likes: 41
      },
      {
        id: randomUUID(),
        title: 'IoT Device Management Platform',
        description: 'Comprehensive platform for managing IoT devices with real-time monitoring, data collection, and analytics. Supports thousands of concurrent devices.',
        price: 42000,
        status: 'active',
        seller_id: randomUUID(), // Different seller
        category: 'IoT',
        tech_stack: ['Python', 'Django', 'MQTT', 'InfluxDB'],
        created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        views: 123,
        likes: 19
      }
    ];

    // Insert user products
    console.log('📦 Creating user products...');
    const { data: userProductsData, error: userProductsError } = await supabase
      .from('products')
      .upsert(userProducts, { onConflict: 'id' });

    if (userProductsError) {
      console.error('❌ Error creating user products:', userProductsError);
    } else {
      console.log('✅ User products created successfully');
      console.log(`   - ${userProducts.length} products added for user`);
    }

    // Insert liked products
    console.log('❤️ Creating liked products...');
    const { data: likedProductsData, error: likedProductsError } = await supabase
      .from('products')
      .upsert(likedProducts, { onConflict: 'id' });

    if (likedProductsError) {
      console.error('❌ Error creating liked products:', likedProductsError);
    } else {
      console.log('✅ Liked products created successfully');
      console.log(`   - ${likedProducts.length} products added from other users`);
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

    console.log('\n🎉 Real user data creation completed!');
    console.log('📊 Summary:');
    console.log(`   - User: ${signInData.user.email}`);
    console.log(`   - User ID: ${userId}`);
    console.log(`   - ${userProducts.length} user products created`);
    console.log(`   - ${likedProducts.length} liked products created`);
    console.log(`   - Profile updated with liked products`);
    console.log('\n💡 Now when users login to /profile, they will see:');
    console.log('   - Their own product listings in the Activity tab');
    console.log('   - Products they have liked from other users');
    console.log('   - Real statistics and data from the database');
    console.log('   - Complete profile management functionality');

  } catch (error) {
    console.error('❌ Error creating real user data:', error);
  }
}

// Run the script
createRealUserData();
