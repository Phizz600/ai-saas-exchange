export interface ListProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  stage: string;
  monthlyRevenue: number;
  monthlyTraffic: number;
  monthlyChurnRate?: number;
  techStack?: string;
  techStackOther?: string;
  integrations?: string;
  integrationsOther?: string;
  grossProfitMargin?: number;
  activeUsers?: number;
  image: File | null;
  isAuction: boolean;
  auctionEndTime?: Date;
  startingPrice?: number;
  minPrice?: number;
  priceDecrement?: number;
  priceDecrementInterval?: string;
  teamSize?: string;
  hasPatents?: boolean;
  competitors?: string;
  demoUrl?: string;
  isVerified?: boolean;
}