
export interface ListProductFormData {
  title: string;
  description: string;
  price?: number;
  category: string;
  categoryOther?: string;
  stage: string;
  industry: string;
  industryOther?: string;
  monthlyRevenue?: number;
  monthlyTraffic: string;
  activeUsers: string;
  grossProfitMargin?: number;
  image: File | null;
  isAuction: boolean;
  startingPrice?: number;
  reservePrice?: number; // Renamed from minPrice
  reservePricePercent?: number; // New field for percentage-based reserve price
  priceDecrement?: number;
  priceDecrementInterval: string;
  techStack: string;
  techStackOther?: string;
  teamSize: string;
  hasPatents: boolean;
  competitors: string;
  demoUrl: string;
  isVerified: boolean;
  specialNotes: string;
  accuracyAgreement: boolean;
  termsAgreement: boolean;
  businessType: "B2B" | "B2C";
  deliverables: string[];
  productLink?: string;
  
  // Additional fields for extended functionality
  monthlyProfit?: number;
  monthlyChurnRate?: number;
  customerAcquisitionCost?: number;
  monetization?: string;
  monetizationOther?: string;
  businessModel?: string;
  investmentTimeline?: string;
  auctionEndTime?: Date;
  auctionDuration?: string; // New field for auction duration in days
  llmType?: string;
  llmTypeOther?: string;
  integrations_other?: string;
  isGoogleAnalyticsVerified?: boolean;
  isRevenueVerified?: boolean;
  isCodeAudited?: boolean;
  isTrafficVerified?: boolean;
  productAge?: string;
  businessLocation?: string;
  numberOfEmployees?: string;
  requires_nda?: boolean;
  nda_content?: string;
}
