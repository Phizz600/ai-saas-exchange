import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Star, Shield, Zap, Building2, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { VerificationBadges } from "./VerificationBadges";

interface ProductStatsProps {
  product: {
    id: string;
    monthly_revenue?: number;
    monthly_profit?: number;
    gross_profit_margin?: number;
    tech_stack?: string;
    tech_stack_other?: string;
    integrations_other?: string;
    team_size?: string;
    stage?: string;
    special_notes?: string;
    is_revenue_verified?: boolean;
    is_code_audited?: boolean;
    is_traffic_verified?: boolean;
  };
}

export function ProductStats({ product }: ProductStatsProps) {
  // Safely format the monthly revenue with a default of 0
  const formattedRevenue = product.monthly_revenue 
    ? formatCurrency(product.monthly_revenue)
    : '$0';

  const formattedProfit = product.monthly_profit
    ? formatCurrency(product.monthly_profit)
    : 'Not disclosed';

  const getRevenueStatus = () => {
    if (!product.monthly_revenue || product.monthly_revenue === 0) {
      return `Beta: Revenue starts ${product.stage === 'MVP' ? 'Q3 2024' : 'Q3 2025'}`;
    }
    return `Monthly Profit: ${formattedProfit}`;
  };

  const getTechStack = () => {
    if (product.tech_stack_other) {
      return product.tech_stack_other;
    }
    return product.tech_stack 
      ? `Built with ${product.tech_stack}, AWS, GPT-4`
      : "Tech stack details coming soon";
  };

  const getTeamComposition = () => {
    if (!product.team_size) return "Team details coming soon";
    
    const sizeToEngineers: Record<string, string> = {
      "1-5": "Core Team: 2 Engineers, 1 Data Scientist",
      "5-10": "Core Team: 5 Engineers, 2 Data Scientists",
      "10-20": "Core Team: 8 Engineers, 3 Data Scientists",
      "20+": "Core Team: 15+ Engineers, 5 Data Scientists"
    };
    
    return sizeToEngineers[product.team_size] || "Team details coming soon";
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Critical Buyer Details</h3>
      <VerificationBadges
        isRevenueVerified={!!product.is_revenue_verified}
        isCodeAudited={!!product.is_code_audited}
        isTrafficVerified={!!product.is_traffic_verified}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <TrendingUp className="h-4 w-4" />
            <span>Monthly Revenue</span>
          </div>
          <p className="text-lg font-semibold">{formattedRevenue}</p>
          <p className="text-sm text-gray-600">{getRevenueStatus()}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Info className="h-4 w-4" />
            <span>Gross Profit Margin</span>
          </div>
          <p className="text-lg font-semibold">
            {product.gross_profit_margin ? `${product.gross_profit_margin}%` : 'Not disclosed'}
          </p>
          <p className="text-sm text-gray-600">Based on current operations</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Zap className="h-4 w-4" />
            <span>Tech Stack</span>
          </div>
          <p className="text-lg font-semibold">Enterprise Grade</p>
          <p className="text-sm text-gray-600">{getTechStack()}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Building2 className="h-4 w-4" />
            <span>Team Composition</span>
          </div>
          <p className="text-lg font-semibold">Expert Team</p>
          <p className="text-sm text-gray-600">{getTeamComposition()}</p>
        </div>

        {product.special_notes && (
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Star className="h-4 w-4" />
              <span>Special Notes</span>
            </div>
            <p className="text-lg font-semibold">Key Highlights</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {product.special_notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
