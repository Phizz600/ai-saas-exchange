
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
}
