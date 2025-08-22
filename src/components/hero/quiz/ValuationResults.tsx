
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, TrendingUp, AlertTriangle, BarChart } from "lucide-react";
import { Link } from "react-router-dom";

interface ValuationResultsProps {
  valuation: {
    estimatedValue: {
      low: number;
      high: number;
    };
    insights: string[];
    recommendations: string[];
    confidenceScore: number;
  };
  onContinue: () => void;
}

// Local formatCurrency function to avoid import issues
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  } else {
    return `$${value.toFixed(0)}`;
  }
};

export const ValuationResults = ({ valuation, onContinue }: ValuationResultsProps) => {
  const { estimatedValue, insights, recommendations, confidenceScore } = valuation;
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Link to="/" className="inline-block mb-6">
          <img 
            src="/lovable-uploads/8f58f067-4427-4557-9a81-869fb3493e23.png" 
            alt="AI Exchange Club" 
            className="h-16 w-auto mx-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => console.log('Logo loaded successfully')}
          />
        </Link>
        <h3 className="text-xl font-bold mb-2">Your AI SaaS Valuation Results</h3>
        <div className="bg-[#6366f1]/10 rounded-lg p-6 mb-4">
          <p className="text-sm text-gray-600 mb-2">Estimated Value Range</p>
          <p className="text-3xl font-bold text-[#6366f1]">
            {formatCurrency(estimatedValue.low)} - {formatCurrency(estimatedValue.high)}
          </p>
          <div className="flex items-center justify-center mt-2">
            <BarChart className="h-4 w-4 text-gray-500 mr-1" />
            <p className="text-sm text-gray-600">
              {confidenceScore}% confidence score
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-semibold mb-2 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-[#6366f1]" />
          Key Insights
        </h4>
        <ul className="space-y-2">
          {insights && insights.length > 0 ? (
            insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">{insight}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">
              No insights available at this time
            </li>
          )}
        </ul>
      </div>
      
      <div>
        <h4 className="text-md font-semibold mb-2 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Recommendations to Increase Value
        </h4>
        <ul className="space-y-2">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">
              No recommendations available at this time
            </li>
          )}
        </ul>
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={onContinue} 
          className="w-full bg-[#8b5cf6] hover:bg-[#7c4def]"
        >
          Continue to Share Results <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          Your detailed report will be sent to your email after providing your contact information
        </p>
      </div>
    </div>
  );
};
