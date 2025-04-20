
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { NotificationSheet } from "./notifications/NotificationSheet";
import { FilterState } from "@/types/marketplace";

interface MarketplaceHeaderProps {
  filters: FilterState;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  isLoading: boolean;
  notifications: any[];
  unreadCount: number;
  onMarkAsRead: (notificationId: string) => Promise<void>;
}

export const MarketplaceHeader = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  isLoading,
  notifications,
  unreadCount,
  onMarkAsRead,
}: MarketplaceHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <SearchFilters
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        onResetFilters={onResetFilters}
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
