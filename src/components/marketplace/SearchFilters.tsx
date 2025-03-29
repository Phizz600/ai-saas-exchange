
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { FilterSection } from "./filters/FilterSection";
import { motion } from "framer-motion";

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

const sortOptions = [{
  value: "relevant",
  label: "Most Relevant"
}, {
  value: "price_asc",
  label: "Lowest Price"
}, {
  value: "price_desc",
  label: "Highest Price"
}, {
  value: "recent",
  label: "Most Recent"
}, {
  value: "popular",
  label: "Most Popular"
}];

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  industryFilter: string;
  setIndustryFilter: (industry: string) => void;
  stageFilter: string;
  setStageFilter: (stage: string) => void;
  priceFilter: string;
  setPriceFilter: (price: string) => void;
  timeFilter: string;
  setTimeFilter: (time: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isLoading?: boolean;
}

export const SearchFilters = ({
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
  isLoading = false
}: SearchFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [debouncedSearchQuery] = useDebounce(localSearchQuery, 300);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Sync local state with parent state when props change
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);
  
  // Update parent search query when debounced query changes
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);
  
  const hasActiveFilters = searchQuery || industryFilter !== 'all' || stageFilter !== 'all' || priceFilter !== 'all' || timeFilter !== 'all';
  
  const clearAllFilters = () => {
    setLocalSearchQuery('');
    setSearchQuery('');
    setIndustryFilter('all');
    setStageFilter('all');
    setPriceFilter('all');
    setTimeFilter('all');
    setSortBy('relevant');
    setIsSheetOpen(false);
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
    
    return filters;
  };

  const activeFilters = renderActiveFilters();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative flex-grow max-w-2xl">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search AI products..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 focus:border-[#8B5CF6] transition-colors bg-white h-10 md:h-11 shadow-sm hover:shadow-md"
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

        <div className="flex gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="bg-white border-gray-200 shadow-sm hover:shadow-md">
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
                {hasActiveFilters && (
                  <Button 
                    variant="destructive" 
                    className="w-full mt-4"
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

      {/* Active Filters */}
      {hasActiveFilters && activeFilters.length > 0 && (
        <motion.div 
          className="flex flex-wrap gap-2 pt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeFilters}
          {activeFilters.length > 1 && (
            <Badge 
              variant="outline" 
              className="cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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
