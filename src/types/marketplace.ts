
export interface FilterState {
  searchQuery: string;
  industryFilter: string;
  stageFilter: string;
  priceFilter: string;
  timeFilter: string;
  sortBy: string;
  showVerifiedOnly: boolean;
  showAuctionsOnly: boolean;
  showBuyNowOnly: boolean;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  stage?: string;
  monthly_revenue?: number;
  image_url?: string;
  seller?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
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
  
  // Additional fields for compatibility
  created_at?: string;
  status?: string;
  views?: number;
  min_price?: number;
  starting_price?: number;
  highest_bid?: number;
  highest_bidder_id?: string;
}

// Define a more complete ProductWithSeller interface that includes all required fields
export interface ProductWithSeller extends MarketplaceProduct {
  seller: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
  
  // Add seller_id which is required by ProductGrid
  seller_id: string;
  
  // Additional fields from ProductGrid - these are now required, not optional
  active_users: string;
  admin_feedback: string;
  auction_end_time: string; // Made non-optional
  auction_status: string;
  business_location: string;
  business_model: string;
  business_type: string;
  category: string;
  category_other: string;
  competitors: string;
  customer_acquisition_cost: number;
  current_price: number; // Make current_price required
  demo_url: string;
  deliverables: string[];
  description: string; // Make description required
  gross_profit_margin: number; // Make gross_profit_margin required
  has_patents: boolean;
  industry: string;
  industry_other: string;
  integrations: string[];
  integrations_other: string;
  investment_timeline: string;
  is_verified: boolean;
  llm_type: string;
  llm_type_other: string;
  monetization: string;
  monetization_other: string;
  monthly_expenses: any;
  monthly_profit: number;
  number_of_employees: string;
  payment_status: string;
  product_age: string;
  product_link: string;
  reviewed_at: string;
  reviewed_by: string;
  special_notes: string;
  team_size: string;
  tech_stack: string[];
  tech_stack_other: string;
  
  // Required fields that were previously optional
  created_at: string;
  status: string;
  updated_at: string;

  // Make highest_bid required and provide a default value
  highest_bid: number;
  
  // Make highest_bidder_id required
  highest_bidder_id: string;

  // Make image_url required
  image_url: string;

  // Make is_code_audited required and provide a default value
  is_code_audited: boolean;
  
  // Make other verification-related fields required
  is_revenue_verified: boolean;
  is_traffic_verified: boolean;
  
  // Make listing_type required
  listing_type: string;
}
