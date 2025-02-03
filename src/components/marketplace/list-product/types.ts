export interface ListProductFormData {
  title: string;
  description: string;
  category: string;
  stage: string;
  industry: string;
  monthlyRevenue: number;
  monthlyTraffic: string;
  monthlyChurnRate?: number;
  techStack?: string;
  techStackOther?: string;
  integrations?: string;
  integrationsOther?: string;
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
}