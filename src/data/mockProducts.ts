export const mockProducts = [
  {
    id: "1",  // Changed to string/uuid
    title: "AI Content Generator",
    description: "Generate high-quality content using advanced AI models",
    price: 25000,
    category: "Content Generation",
    stage: "Revenue",
    monthly_revenue: 5000,  // Changed from monthlyRevenue
    image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",  // Changed from image
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seller_id: "1",  // Changed from seller object to just ID
  },
  {
    id: "2",
    title: "ChatBot Builder",
    description: "Create custom chatbots for customer service",
    price: 15000,
    category: "Customer Service",
    stage: "MVP",
    monthly_revenue: 0,
    image_url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seller_id: "2",
  },
  {
    id: "3",
    title: "AI Image Generator",
    description: "Create stunning images using state-of-the-art AI models",
    price: 35000,
    category: "Image Generation",
    stage: "Revenue",
    monthly_revenue: 7500,
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seller_id: "3",
  },
  {
    id: "4",
    title: "AI Code Assistant",
    description: "Intelligent code completion and suggestions powered by AI",
    price: 45000,
    category: "Development Tools",
    stage: "Revenue",
    monthly_revenue: 9000,
    image_url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seller_id: "4",
  }
];