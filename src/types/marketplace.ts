
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
  
  // Additional fields from ProductWithSeller
  active_users?: string;
  admin_feedback?: string;
  auction_status?: string;
  business_location?: string;
  business_model?: string;
  business_type?: string;
  status?: string;
}

// Define an interface that extends Database types to ensure compatibility with ProductGrid
export interface ProductWithSeller extends MarketplaceProduct {
  // This is just a compatibility interface to satisfy the type checker
  // It should have all fields from MarketplaceProduct plus any additional fields
  // that might be required by the ProductGrid component
  seller: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}
