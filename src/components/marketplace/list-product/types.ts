
export interface ListProductFormData {
  title: string;
  description: string;
  price?: number;
  category: string;
  stage: string;
  industry: string;
  monthlyRevenue?: number;
  monthlyTraffic: string;
  activeUsers: string;
  grossProfitMargin?: number;
  image: File | null;
  isAuction: boolean;
  startingPrice?: number;
  minPrice?: number;
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
  
  // Additional fields for extended functionality
  monthlyProfit?: number;
  monthlyChurnRate?: number;
  customerAcquisitionCost?: number;
  monetization?: string;
  monetizationOther?: string;
  businessModel?: string;
  investmentTimeline?: string;
  auctionEndTime?: Date;
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
  industryOther?: string;
  categoryOther?: string;
}
