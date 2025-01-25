export interface ListProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  stage: string;
  monthlyRevenue: number;
  monthlyTraffic: number;
  image: File | null;
}