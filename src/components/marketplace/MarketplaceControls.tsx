import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, RefreshCw } from "lucide-react";
interface MarketplaceControlsProps {
  showVerifiedOnly: boolean;
  onVerifiedChange: (checked: boolean) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}
export const MarketplaceControls = ({
  showVerifiedOnly,
  onVerifiedChange,
  isRefreshing,
  onRefresh
}: MarketplaceControlsProps) => {
  return <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      
      
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing} className="w-full sm:w-auto flex items-center gap-1 py-2">
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>;
};