
export interface ListProductFormData {
  title: string;
  description: string;
  price?: number;
  category: string;
  categoryOther?: string;
  stage: string;
  industry: string;
  industryOther?: string;
  monthlyRevenue: number;
  monthlyProfit?: number;
  monthlyTraffic: string;
  monthlyChurnRate?: number;
  techStack?: string;
  techStackOther?: string;
  grossProfitMargin?: number;
  activeUsers?: string;
  image: File | null;
  isAuction: boolean;
  auctionEndTime?: Date;
  startingPrice?: number;
  minPrice?: number;
  priceDecrement?: number;
  priceDecrementInterval?: 'minute' | 'hour' | 'day' | 'week' | 'month';
  teamSize?: string;
  hasPatents?: boolean;
  competitors?: string;
  demoUrl?: string;
  isVerified?: boolean;
  isGoogleAnalyticsVerified?: boolean;
  sellerName?: string;
  sellerEmail?: string;
  numberOfEmployees?: string;
  productAge?: string;
  businessLocation?: string;
  integrations_other?: string;
  specialNotes?: string;
}
