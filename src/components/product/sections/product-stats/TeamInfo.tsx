
import { Users } from "lucide-react";
import { hasValue } from "@/utils/productHelpers";

interface TeamInfoProps {
  product: {
    team_size?: string;
    number_of_employees?: string;
    business_location?: string;
  };
}

export function TeamInfo({ product }: TeamInfoProps) {
  // Check if we have any team info to display
  const hasTeamSize = hasValue(product.team_size);
  const hasEmployees = hasValue(product.number_of_employees);
  const hasLocation = hasValue(product.business_location);
  
  // If no team info at all, don't render the component
  if (!hasTeamSize && !hasEmployees && !hasLocation) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Users className="h-4 w-4" />
        <span>Team Information</span>
      </div>
      <div className="space-y-3">
        {hasTeamSize && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Team Size</span>
            <span className="font-medium">{product.team_size}</span>
          </div>
        )}
        
        {hasEmployees && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Number of Employees</span>
            <span className="font-medium">{product.number_of_employees}</span>
          </div>
        )}
        
        {hasLocation && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Business Location</span>
            <span className="font-medium">{product.business_location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
