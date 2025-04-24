
export interface Seller {
  id: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  stage?: string;
  monthly_revenue?: number;
  image_url?: string;
  seller?: Seller;
  seller_id?: string;
  monthly_traffic?: number;
  gross_profit_margin?: number;
  monthly_churn_rate?: number;
  is_revenue_verified?: boolean;
  is_code_audited?: boolean;
  is_traffic_verified?: boolean;
  requires_nda?: boolean;
  nda_content?: string;
  auction_end_time?: string;
  current_price?: number;
  reserve_price?: number;
  price_decrement?: number;
  price_decrement_interval?: string;
  no_reserve?: boolean;
  listing_type?: string;
  updated_at?: string;
  special_notes?: string;
  demo_url?: string;
  
  // Add properties to fix compatibility issues
  monthlyRevenue?: number; // Alias for monthly_revenue
  image?: string; // Alias for image_url
}
