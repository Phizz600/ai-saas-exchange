
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { NotificationSheet } from "./notifications/NotificationSheet";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MarketplaceHeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  industryFilter: string;
  setIndustryFilter: (value: string) => void;
  stageFilter: string;
  setStageFilter: (value: string) => void;
  priceFilter: string;
  setPriceFilter: (value: string) => void;
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  isLoading: boolean;
  notifications: any[];
  unreadCount: number;
  onMarkAsRead: (notificationId: string) => Promise<void>;
  showAuctionsOnly: boolean;
  setShowAuctionsOnly: (show: boolean) => void;
  showBuyNowOnly: boolean;
  setShowBuyNowOnly: (show: boolean) => void;
}

export const MarketplaceHeader = ({
  searchQuery,
  setSearchQuery,
  industryFilter,
  setIndustryFilter,
  stageFilter,
  setStageFilter,
  priceFilter,
  setPriceFilter,
  timeFilter,
  setTimeFilter,
  sortBy,
  setSortBy,
  isLoading,
  notifications,
  unreadCount,
  onMarkAsRead,
  showAuctionsOnly,
  setShowAuctionsOnly,
  showBuyNowOnly,
  setShowBuyNowOnly
}: MarketplaceHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        industryFilter={industryFilter}
        setIndustryFilter={setIndustryFilter}
        stageFilter={stageFilter}
        setStageFilter={setStageFilter}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isLoading={isLoading}
        showAuctionsOnly={showAuctionsOnly}
        setShowAuctionsOnly={setShowAuctionsOnly}
        showBuyNowOnly={showBuyNowOnly}
        setShowBuyNowOnly={setShowBuyNowOnly}
      />

      <NotificationSheet 
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={onMarkAsRead}
      />
    </div>
  );
};
