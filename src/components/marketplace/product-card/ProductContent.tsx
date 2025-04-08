
import { ProductBadges } from "./ProductBadges";
import { ProductMetrics } from "./ProductMetrics";
import { formatCurrency } from "@/lib/utils";

interface ProductContentProps {
  title: string;
  description?: string;
  price?: number;
  current_price?: number;
  category?: string;
  stage?: string;
  monthlyRevenue?: number;
  monthly_traffic?: number;
  gross_profit_margin?: number;
  monthly_churn_rate?: number;
  is_revenue_verified?: boolean;
  is_code_audited?: boolean;
  is_traffic_verified?: boolean;
  requires_nda?: boolean;
}

export function ProductContent({
  title,
  description,
  price,
  current_price,
  category,
  stage,
  monthlyRevenue,
  monthly_traffic,
  gross_profit_margin,
  monthly_churn_rate,
  is_revenue_verified,
  is_code_audited,
  is_traffic_verified,
  requires_nda
}: ProductContentProps) {
  // Ensure price values are either valid numbers or 0
  const displayPrice = (current_price || price || 0);
  
  return (
    <div className="p-5 space-y-4">
      {/* Category & Stage Pills at the top */}
      <ProductBadges category={category} stage={stage} requiresNda={requires_nda} />
      
      {/* Title - Modified to show "Confidential" for NDA-required products */}
      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#8B5CF6] transition-colors duration-200 exo-2-heading">
        {requires_nda ? "Confidential" : title}
      </h3>
      
      {/* Description - Added here */}
      {description && !requires_nda && (
        <p className="text-sm text-gray-600 line-clamp-2">
          {description}
        </p>
      )}
      
      {/* If NDA is required, show placeholder text */}
      {requires_nda && (
        <p className="text-sm text-gray-600 italic">
          Additional details available after signing NDA
        </p>
      )}
      
      {/* Price in green - making the font size smaller and left aligned */}
      <div className="text-xl font-bold text-green-600 text-left">
        {formatCurrency(displayPrice)}
      </div>
      
      {/* Show metrics for ALL products, whether NDA is required or not */}
      <ProductMetrics 
        monthlyRevenue={monthlyRevenue}
        monthly_traffic={monthly_traffic}
        gross_profit_margin={gross_profit_margin}
        monthly_churn_rate={monthly_churn_rate}
        is_revenue_verified={is_revenue_verified}
        is_code_audited={is_code_audited}
        is_traffic_verified={is_traffic_verified}
      />
    </div>
  );
}
