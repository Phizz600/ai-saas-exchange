
import { Users } from "lucide-react";

interface TeamInfoProps {
  product: {
    team_size?: string;
    number_of_employees?: string;
    business_location?: string;
  };
}

export function TeamInfo({ product }: TeamInfoProps) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Users className="h-4 w-4" />
        <span>Team Information</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Team Size</span>
          <span className="font-medium">{product.team_size || "Not specified"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Number of Employees</span>
          <span className="font-medium">{product.number_of_employees || "Not specified"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Business Location</span>
          <span className="font-medium">{product.business_location || "Not specified"}</span>
        </div>
      </div>
    </div>
  );
}
