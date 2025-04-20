import { Info, Link, Globe, Users, Activity, Calendar } from "lucide-react";
import { ProductMetrics } from "./ProductMetrics";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { hasValue } from "@/utils/productHelpers";

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
    monthly_traffic?: string | number;
    active_users?: string;
  };
}

export function ProductOverview({ product }: ProductOverviewProps) {
  // Convert monthly_traffic to string if it's a number
  const monthlyTrafficString = typeof product.monthly_traffic === 'number' 
    ? product.monthly_traffic.toString()
    : product.monthly_traffic || '';
    
  // Get stage badge color
  const getStageBadgeColor = (stage?: string) => {
    switch(stage?.toLowerCase()) {
      case 'idea':
        return 'bg-blue-100 text-blue-700';
      case 'prototype':
        return 'bg-purple-100 text-purple-700';
      case 'beta':
        return 'bg-amber-100 text-amber-700';
      case 'growth':
        return 'bg-green-100 text-green-700';
      case 'established':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter out fields that don't have values
  const displayFields = {
    businessType: hasValue(product.business_type) ? {
      label: "Business Type",
      value: product.business_type,
      tooltip: "The type of business structure or organization."
    } : null,
    businessModel: hasValue(product.business_model) ? {
      label: "Business Model",
      value: product.business_model,
      tooltip: "How the business generates revenue and delivers value to customers."
    } : null,
    categoryDetails: hasValue(product.category_other) ? {
      label: "Category Details",
      value: product.category_other
    } : null,
    industryDetails: hasValue(product.industry_other) ? {
      label: "Industry Details",
      value: product.industry_other
    } : null,
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Info className="h-4 w-4" />
        <span>Product Overview</span>
      </div>
      
      {/* Main Product Information */}
      <div className="mb-6 p-4 border border-gray-100 rounded-lg bg-gradient-to-br from-white to-gray-50">
        {hasValue(product.title) && (
          <h3 className="font-bold text-lg mb-2 text-gray-800">{product.title}</h3>
        )}
        <div className="flex flex-wrap gap-2 mb-3">
          {hasValue(product.stage) && (
            <Badge className={getStageBadgeColor(product.stage)}>
              {product.stage}
            </Badge>
          )}
          {hasValue(product.category) && (
            <Badge variant="outline" className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20">
              {product.category}
            </Badge>
          )}
          {hasValue(product.industry) && (
            <Badge variant="outline" className="bg-[#0EA4E9]/10 text-[#0EA4E9] border-[#0EA4E9]/20">
              {product.industry}
            </Badge>
          )}
        </div>
        
        {hasValue(product.product_age) && (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Age: {product.product_age}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {/* Product Links */}
        {hasValue(product.product_link) && (
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
            <span className="text-gray-600">Product Link</span>
            <a href={product.product_link} target="_blank" rel="noopener noreferrer" 
               className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
              Visit <Link className="h-3 w-3" />
            </a>
          </div>
        )}
        
        {/* Display filtered fields with tooltips */}
        <TooltipProvider>
          {Object.entries(displayFields).map(([key, field]) => 
            field && (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md cursor-help">
                    <span className="text-gray-600">{field.label}</span>
                    <span className="font-medium">{field.value}</span>
                  </div>
                </TooltipTrigger>
                {field.tooltip && (
                  <TooltipContent>
                    <p className="text-sm max-w-xs">{field.tooltip}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          )}
        </TooltipProvider>
      </div>

      {/* Traffic and User Metrics Section */}
      {(hasValue(monthlyTrafficString) || hasValue(product.active_users)) && (
        <div className="mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Activity className="h-4 w-4" />
            <span>Traffic & User Metrics</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hasValue(monthlyTrafficString) && (
              <div className="p-3 rounded-md bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                <span className="text-xs text-gray-600 block mb-1">Monthly Traffic</span>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">{monthlyTrafficString}</span>
                </div>
              </div>
            )}
            
            {hasValue(product.active_users) && (
              <div className="p-3 rounded-md bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <span className="text-xs text-gray-600 block mb-1">Active Users</span>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">{product.active_users}</span>
                </div>
              </div>
            )}
          </div>
          
          {hasValue(product.demo_url) && (
            <a 
              href={product.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 mt-4 text-[#8B5CF6] border border-[#8B5CF6] rounded-md hover:bg-[#8B5CF6]/10 transition-colors"
            >
              <Globe className="h-4 w-4" />
              View Live Demo
            </a>
          )}
        </div>
      )}
    </div>
  );
}
