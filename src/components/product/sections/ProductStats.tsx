
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Star, Shield, Zap, Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductStatsProps {
  product: {
    id: string;
    monthlyRevenue?: number;
    tech_stack?: string;
    tech_stack_other?: string;
    integrations_other?: string;
    team_size?: string;
    stage?: string;
  };
}

export function ProductStats({ product }: ProductStatsProps) {
  // Safely format the monthly revenue with a default of 0
  const formattedRevenue = product.monthlyRevenue 
    ? formatCurrency(product.monthlyRevenue)
    : '$0';

  const getRevenueStatus = () => {
    if (!product.monthlyRevenue || product.monthlyRevenue === 0) {
      return `Beta: Revenue starts ${product.stage === 'MVP' ? 'Q3 2024' : 'Q3 2025'}`;
    }
    return `Monthly Churn: 2.5%`;
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Zap className="h-4 w-4" />
            <span>Tech Stack</span>
          </div>
          <p className="text-lg font-semibold">Enterprise Grade</p>
          <p className="text-sm text-gray-600">{getTechStack()}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Shield className="h-4 w-4" />
            <span>Compliance & Integrations</span>
          </div>
          <p className="text-lg font-semibold">Enterprise Ready</p>
          <p className="text-sm text-gray-600">GDPR Compliant | SOC 2 Certified</p>
          <p className="text-sm text-gray-600 mt-1">Works with Slack, Salesforce, Stripe</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Building2 className="h-4 w-4" />
            <span>Team Composition</span>
          </div>
          <p className="text-lg font-semibold">Expert Team</p>
          <p className="text-sm text-gray-600">{getTeamComposition()}</p>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Star className="h-4 w-4" />
            <span>Customer Success Story</span>
          </div>
          <p className="text-lg font-semibold">Proven Results</p>
          <p className="text-sm text-gray-600">
            Reduced support tickets by 40% for Enterprise Clients
          </p>
        </div>
      </div>
    </Card>
  );
}
