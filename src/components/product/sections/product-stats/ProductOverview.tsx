import { Info, Link, Globe } from "lucide-react";
import { ProductMetrics } from "./ProductMetrics";

interface ProductOverviewProps {
  product: {
    title?: string;
    product_link?: string;
    category?: string;
    category_other?: string;
    industry?: string;
    industry_other?: string;
    stage?: string;
    business_type?: string;
    business_model?: string;
    product_age?: string;
    demo_url?: string;
    monthly_traffic?: string;
    active_users?: string;
  };
}

export function ProductOverview({ product }: ProductOverviewProps) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Info className="h-4 w-4" />
        <span>Product Overview</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Product Name</span>
          <span className="font-medium">{product.title}</span>
        </div>
        {product.product_link && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Product Link</span>
            <a href={product.product_link} target="_blank" rel="noopener noreferrer" 
               className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Visit <Link className="h-3 w-3" />
            </a>
          </div>
        )}
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Category</span>
          <span className="font-medium">{product.category}</span>
        </div>
        {product.category_other && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Category Details</span>
            <span className="font-medium">{product.category_other}</span>
          </div>
        )}
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Industry</span>
          <span className="font-medium">{product.industry || "Not specified"}</span>
        </div>
        {product.industry_other && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Industry Details</span>
            <span className="font-medium">{product.industry_other}</span>
          </div>
        )}
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Stage</span>
          <span className="font-medium">{product.stage}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Business Type</span>
          <span className="font-medium">{product.business_type || "Not specified"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Business Model</span>
          <span className="font-medium">{product.business_model || "Not specified"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Product Age</span>
          <span className="font-medium">{product.product_age || "Not specified"}</span>
        </div>
        
        <ProductMetrics 
          monthlyTraffic={product.monthly_traffic || ''} 
          activeUsers={product.active_users || ''}
        />
        
        {product.demo_url && (
          <a 
            href={product.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 mt-2 text-[#8B5CF6] border border-[#8B5CF6] rounded-md hover:bg-[#8B5CF6]/10 transition-colors"
          >
            <Globe className="h-4 w-4" />
            View Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
