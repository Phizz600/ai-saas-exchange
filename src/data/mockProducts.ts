import { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

export const mockProducts: Product[] = [
  {
    id: "1",
    title: "AI Content Generator",
    description: "Generate high-quality content using advanced AI",
    price: 999,
    category: "Content Generation",
    stage: "Revenue",
    monthly_revenue: 5000,
    monthly_traffic: 1000,
    image_url: "/placeholder.svg",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seller_id: null,
    auction_end_time: null,
    starting_price: null,
    current_price: null,
    min_price: null,
    price_decrement: null
  },
  {
    id: "2",
    title: "Customer Service Bot",
    description: "24/7 customer support automation",
    price: 1499,
    category: "Customer Service",
    stage: "MVP",
    monthly_revenue: 0,
    monthly_traffic: 500,
    image_url: "/placeholder.svg",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seller_id: null,
    auction_end_time: null,
    starting_price: null,
    current_price: null,
    min_price: null,
    price_decrement: null
  }
];