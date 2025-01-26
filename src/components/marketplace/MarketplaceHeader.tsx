import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { NotificationSheet } from "./notifications/NotificationSheet";

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
  onMarkAsRead: () => void;
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
  onMarkAsRead
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
      />

      <NotificationSheet 
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={onMarkAsRead}
      />
    </div>
  );
};