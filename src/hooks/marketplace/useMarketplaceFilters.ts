
import { useState, useCallback } from 'react';
import { FilterState } from '@/types/marketplace';

const initialFilterState: FilterState = {
  searchQuery: '',
  industryFilter: 'all',
  stageFilter: 'all',
  priceFilter: 'all',
  timeFilter: 'all',
  sortBy: 'relevant',
  showVerifiedOnly: false,
  showAuctionsOnly: false,
  showBuyNowOnly: false
};

export const useMarketplaceFilters = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters
  };
};
