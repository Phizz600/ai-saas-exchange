import { Search, SlidersHorizontal, X, Loader2, Timer, Tag, ArrowDownUp, Clock, TrendingUp, Eye, DollarSign, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { FilterSection } from "./filters/FilterSection";
import { motion } from "framer-motion";
import { Toggle } from "@/components/ui/toggle";
import { FilterState } from "@/types/marketplace";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

const industries = [{
  value: "all",
  label: "All Industries"
}, {
  value: "content_generation",
  label: "Content Generation"
}, {
  value: "customer_service",
  label: "Customer Service"
}, {
  value: "image_generation",
  label: "Image Generation"
}, {
  value: "development_tools",
  label: "Development Tools"
}, {
  value: "audio_processing",
  label: "Audio Processing"
}, {
  value: "finance",
  label: "Finance"
}, {
  value: "video_processing",
  label: "Video Processing"
}];

const stages = [{
  value: "all",
  label: "All Stages"
}, {
  value: "mvp",
  label: "MVP"
}, {
  value: "revenue",
  label: "Revenue"
}, {
  value: "pre_revenue",
  label: "Pre-Revenue"
}, {
  value: "beta",
  label: "Beta"
}];

const priceRanges = [{
  value: "all",
  label: "All Prices"
}, {
  value: "0-10000",
  label: "$0 - $10,000"
}, {
  value: "10000-25000",
  label: "$10,000 - $25,000"
}, {
  value: "25000-50000",
  label: "$25,000 - $50,000"
}, {
  value: "50000+",
  label: "$50,000+"
}];

const sortOptions = [
  {
    value: "relevant",
    label: "Most Relevant", 
    icon: <ArrowDownUp className="h-4 w-4 mr-2" />
  },
  {
    value: "newest",
    label: "Newest Listings",
    icon: <Clock className="h-4 w-4 mr-2" />
  },
  {
    value: "fastest_growing", 
    label: "Fastest Growing",
    icon: <TrendingUp className="h-4 w-4 mr-2" />
  },
  {
    value: "most_interest",
    label: "Most Buyer Interest", 
    icon: <Eye className="h-4 w-4 mr-2" />
  },
  {
    value: "highest_revenue",
    label: "Highest Revenue",
    icon: <DollarSign className="h-4 w-4 mr-2" />
  },
  {
    value: "lowest_churn",
    label: "Lowest Churn",
    icon: <Users className="h-4 w-4 mr-2" />
  },
  {
    value: "price_desc",
    label: "Highest Price",
    icon: <ArrowDownUp className="h-4 w-4 mr-2" />
  },
  {
    value: "price_asc",
    label: "Lowest Price",
    icon: <ArrowDownUp className="h-4 w-4 mr-2" />
  }
];

export interface SearchFiltersProps {
  filters: FilterState;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
  
  // For backward compatibility, we'll keep these props but they will be derived from filters
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  industryFilter?: string;
  setIndustryFilter?: (industry: string) => void;
  stageFilter?: string;
  setStageFilter?: (stage: string) => void;
  priceFilter?: string;
  setPriceFilter?: (price: string) => void;
  timeFilter?: string;
  setTimeFilter?: (time: string) => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
  showAuctionsOnly?: boolean;
  setShowAuctionsOnly?: (show: boolean) => void;
  showBuyNowOnly?: boolean;
  setShowBuyNowOnly?: (show: boolean) => void;
}

export const SearchFilters = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  isLoading = false,
  // If the old props are provided, we'll use them, otherwise we'll use the new ones
  searchQuery: propSearchQuery,
  setSearchQuery: propSetSearchQuery,
  industryFilter: propIndustryFilter,
  setIndustryFilter: propSetIndustryFilter,
  stageFilter: propStageFilter,
  setStageFilter: propSetStageFilter,
  priceFilter: propPriceFilter,
  setPriceFilter: propSetPriceFilter,
  timeFilter: propTimeFilter,
  setTimeFilter: propSetTimeFilter,
  sortBy: propSortBy,
  setSortBy: propSetSortBy,
  showAuctionsOnly: propShowAuctionsOnly,
  setShowAuctionsOnly: propSetShowAuctionsOnly,
  showBuyNowOnly: propShowBuyNowOnly,
  setShowBuyNowOnly: propSetShowBuyNowOnly
}: SearchFiltersProps) => {
  // Use either the props passed directly, or get them from the filters object
  const searchQuery = propSearchQuery ?? filters.searchQuery;
  const industryFilter = propIndustryFilter ?? filters.industryFilter;
  const stageFilter = propStageFilter ?? filters.stageFilter;
  const priceFilter = propPriceFilter ?? filters.priceFilter;
  const timeFilter = propTimeFilter ?? filters.timeFilter;
  const sortBy = propSortBy ?? filters.sortBy;
  const showAuctionsOnly = propShowAuctionsOnly ?? filters.showAuctionsOnly;
  const showBuyNowOnly = propShowBuyNowOnly ?? filters.showBuyNowOnly;

  // Define setter functions that use either the old or new approach
  const setSearchQuery = (value: string) => {
    if (propSetSearchQuery) {
      propSetSearchQuery(value);
    } else {
      onUpdateFilter('searchQuery', value);
    }
  };

  const setIndustryFilter = (value: string) => {
    if (propSetIndustryFilter) {
      propSetIndustryFilter(value);
    } else {
      onUpdateFilter('industryFilter', value);
    }
  };

  const setStageFilter = (value: string) => {
    if (propSetStageFilter) {
      propSetStageFilter(value);
    } else {
      onUpdateFilter('stageFilter', value);
    }
  };

  const setPriceFilter = (value: string) => {
    if (propSetPriceFilter) {
      propSetPriceFilter(value);
    } else {
      onUpdateFilter('priceFilter', value);
    }
  };

  const setTimeFilter = (value: string) => {
    if (propSetTimeFilter) {
      propSetTimeFilter(value);
    } else {
      onUpdateFilter('timeFilter', value);
    }
  };

  const setSortBy = (value: string) => {
    if (propSetSortBy) {
      propSetSortBy(value);
    } else {
      onUpdateFilter('sortBy', value);
    }
  };

  const setShowAuctionsOnly = (value: boolean) => {
    if (propSetShowAuctionsOnly) {
      propSetShowAuctionsOnly(value);
    } else {
      onUpdateFilter('showAuctionsOnly', value);
    }
  };

  const setShowBuyNowOnly = (value: boolean) => {
    if (propSetShowBuyNowOnly) {
      propSetShowBuyNowOnly(value);
    } else {
      onUpdateFilter('showBuyNowOnly', value);
    }
  };

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [debouncedSearchQuery] = useDebounce(localSearchQuery, 300);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Sync local state with parent state when props change
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);
  
  // Update parent search query when debounced query changes
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);
  
  // Keep track of filter exclusivity
  useEffect(() => {
    if (showBuyNowOnly && showAuctionsOnly) {
      // If both are enabled, disable auctions (prioritize the most recently enabled one)
      setShowAuctionsOnly(false);
    }
  }, [showBuyNowOnly, showAuctionsOnly, setShowAuctionsOnly]);
  
  const hasActiveFilters = searchQuery || industryFilter !== 'all' || stageFilter !== 'all' || priceFilter !== 'all' || timeFilter !== 'all' || showAuctionsOnly || showBuyNowOnly;
  
  const clearAllFilters = () => {
    setLocalSearchQuery('');
    setSearchQuery('');
    setIndustryFilter('all');
    setStageFilter('all');
    setPriceFilter('all');
    setTimeFilter('all');
    setSortBy('relevant');
    setShowAuctionsOnly(false);
    setShowBuyNowOnly(false);
    setIsSheetOpen(false);
    
    // If we have the new reset function, call it too
    if (onResetFilters) {
      onResetFilters();
    }
  };

  const renderActiveFilters = () => {
    const filters = [];
    
    if (searchQuery) {
      filters.push(
        <Badge key="search" variant="secondary" className="gap-1">
          Search: {searchQuery}
          <X className="h-3 w-3 cursor-pointer" onClick={() => {
            setLocalSearchQuery('');
            setSearchQuery('');
          }} />
        </Badge>
      );
    }
    if (industryFilter !== 'all') {
      const industryLabel = industries.find(i => i.value === industryFilter)?.label;
      filters.push(
        <Badge key="industry" variant="secondary" className="gap-1">
          Industry: {industryLabel}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setIndustryFilter('all')} />
        </Badge>
      );
    }
    if (stageFilter !== 'all') {
      const stageLabel = stages.find(s => s.value === stageFilter)?.label;
      filters.push(
        <Badge key="stage" variant="secondary" className="gap-1">
          Stage: {stageLabel}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setStageFilter('all')} />
        </Badge>
      );
    }
    if (priceFilter !== 'all') {
      const priceLabel = priceRanges.find(p => p.value === priceFilter)?.label;
      filters.push(
        <Badge key="price" variant="secondary" className="gap-1">
          Price: {priceLabel}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceFilter('all')} />
        </Badge>
      );
    }
    
    if (showAuctionsOnly) {
      filters.push(
        <Badge key="auctions" variant="secondary" className="gap-1 bg-amber-100 text-amber-800 hover:bg-amber-200">
          Auctions Only
          <X className="h-3 w-3 cursor-pointer" onClick={() => setShowAuctionsOnly(false)} />
        </Badge>
      );
    }
    
    if (showBuyNowOnly) {
      filters.push(
        <Badge key="buynow" variant="secondary" className="gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
          Buy It Now Only
          <X className="h-3 w-3 cursor-pointer" onClick={() => setShowBuyNowOnly(false)} />
        </Badge>
      );
    }
    
    if (sortBy !== 'relevant') {
      const sortLabel = sortOptions.find(s => s.value === sortBy)?.label;
      filters.push(
        <Badge key="sort" variant="secondary" className="gap-1 bg-purple-100 text-purple-800 hover:bg-purple-200">
          Sort: {sortLabel}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setSortBy('relevant')} />
        </Badge>
      );
    }
    
    return filters;
  };

  const activeFilters = renderActiveFilters();

  // Handle toggling Buy Now filter
  const handleBuyNowToggle = (pressed: boolean) => {
    setShowBuyNowOnly(pressed);
    if (pressed) {
      setShowAuctionsOnly(false); // Turn off auctions filter when Buy Now is enabled
    }
  };

  // Handle toggling Auctions filter
  const handleAuctionsToggle = (pressed: boolean) => {
    setShowAuctionsOnly(pressed);
    if (pressed) {
      setShowBuyNowOnly(false); // Turn off Buy Now filter when Auctions is enabled
    }
  };

  // Find the icon for the current sort option
  const currentSortOption = sortOptions.find(option => option.value === sortBy);

  return (
    <div className="space-y-3 md:space-y-4 max-w-full">
      <div className="flex flex-col gap-3 md:gap-4 w-full">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search AI products..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 focus:border-[#8B5CF6] transition-colors bg-white h-10 md:h-11 shadow-sm hover:shadow-md w-full min-h-[40px]"
          />
          {localSearchQuery && (
            <button
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => {
                setLocalSearchQuery('');
                setSearchQuery('');
              }}
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200 shadow-sm hover:shadow-md flex gap-1 min-h-[40px]">
              {currentSortOption?.icon}
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="flex items-center">
                  <div className="flex items-center">
                    {option.icon}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 -mx-3 sm:mx-0 px-3 sm:px-0">
            <Toggle 
              pressed={showBuyNowOnly}
              onPressedChange={handleBuyNowToggle}
              variant="outline"
              className="bg-white border-gray-200 hover:bg-blue-50 shadow-sm hover:shadow-md data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 flex-shrink-0 min-h-[40px]"
            >
              <Tag className="h-4 w-4 mr-2" />
              Buy It Now
            </Toggle>
            
            <Toggle 
              pressed={showAuctionsOnly}
              onPressedChange={handleAuctionsToggle}
              variant="outline"
              className="bg-white border-gray-200 hover:bg-amber-50 shadow-sm hover:shadow-md data-[state=on]:bg-amber-100 data-[state=on]:text-amber-800 flex-shrink-0 min-h-[40px]"
            >
              <Timer className="h-4 w-4 mr-2" />
              Auctions
            </Toggle>
            
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-gray-50 border-gray-200 shadow-sm hover:shadow-md flex-shrink-0 min-h-[40px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 bg-[#8B5CF6] text-white">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search with the following filters.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <FilterSection
                    label="Industry"
                    options={industries}
                    value={industryFilter}
                    onValueChange={setIndustryFilter}
                  />
                  <FilterSection
                    label="Stage"
                    options={stages}
                    value={stageFilter}
                    onValueChange={setStageFilter}
                  />
                  <FilterSection
                    label="Price Range"
                    options={priceRanges}
                    value={priceFilter}
                    onValueChange={setPriceFilter}
                  />
                  <FilterSection
                    label="Sort By"
                    options={sortOptions}
                    value={sortBy}
                    onValueChange={setSortBy}
                  />
                  <div className="flex flex-col space-y-2">
                    <div className="text-sm font-medium mb-1">Listing Type</div>
                    <div className="flex items-center space-x-2">
                      <Toggle 
                        pressed={showBuyNowOnly}
                        onPressedChange={handleBuyNowToggle}
                        variant="outline"
                        className="flex-1 justify-start bg-white border-gray-200 hover:bg-blue-50 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 min-h-[44px]"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Buy It Now Only
                      </Toggle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Toggle 
                        pressed={showAuctionsOnly}
                        onPressedChange={handleAuctionsToggle}
                        variant="outline"
                        className="flex-1 justify-start bg-white border-gray-200 hover:bg-amber-50 data-[state=on]:bg-amber-100 data-[state=on]:text-amber-800 min-h-[44px]"
                      >
                        <Timer className="h-4 w-4 mr-2" />
                        Auctions Only
                      </Toggle>
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <Button 
                      variant="destructive" 
                      className="w-full mt-4 min-h-[44px]"
                      onClick={() => {
                        clearAllFilters();
                        setIsSheetOpen(false);
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && activeFilters.length > 0 && (
        <motion.div 
          className="flex flex-wrap gap-2 pt-1 -mx-3 sm:mx-0 px-3 sm:px-0 overflow-x-auto pb-2 sm:pb-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeFilters}
          {activeFilters.length > 1 && (
            <Badge 
              variant="outline" 
              className="cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex-shrink-0"
              onClick={clearAllFilters}
            >
              Clear All <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </motion.div>
      )}

      {isLoading && (
        <div className="flex items-center text-sm text-gray-500">
          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
          Updating results...
        </div>
      )}
    </div>
  );
};
