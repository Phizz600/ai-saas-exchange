
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
  reservePrice?: number;  
  priceDecrement?: number;
  priceDecrementInterval: string;
  techStack: string;  // Changed from array to string for simplicity
  techStackOther?: string;
  teamSize: string;
  hasPatents: boolean;
  competitors: string;
  demoUrl: string;
  isVerified: boolean;
  specialNotes: string;
  accuracyAgreement: boolean;
  termsAgreement: boolean;
  businessType: "B2B" | "B2C" | string;
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
  auctionDuration?: string;
  llmType?: string;
  llmTypeOther?: string;
  integrations?: string[];
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
  noReserve?: boolean;
  monthlyExpenses?: ExpenseItem[];
}

// Define the expense item interface
export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}
