import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { FilterSection } from "./filters/FilterSection";

const industries = [
  { value: "all", label: "All Industries" },
  { value: "content_generation", label: "Content Generation" },
  { value: "customer_service", label: "Customer Service" },
  { value: "image_generation", label: "Image Generation" },
  { value: "development_tools", label: "Development Tools" },
  { value: "audio_processing", label: "Audio Processing" },
  { value: "finance", label: "Finance" },
  { value: "video_processing", label: "Video Processing" }
];

const stages = [
  { value: "all", label: "All Stages" },
  { value: "mvp", label: "MVP" },
  { value: "revenue", label: "Revenue" },
  { value: "pre_revenue", label: "Pre-Revenue" },
  { value: "beta", label: "Beta" }
];

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-10000", label: "$0 - $10,000" },
  { value: "10000-25000", label: "$10,000 - $25,000" },
  { value: "25000-50000", label: "$25,000 - $50,000" },
  { value: "50000+", label: "$50,000+" }
];

const sortOptions = [
  { value: "relevant", label: "Most Relevant" },
  { value: "price_asc", label: "Lowest Price" },
  { value: "price_desc", label: "Highest Price" },
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" }
];

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

  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  const hasActiveFilters = searchQuery || industryFilter !== 'all' || stageFilter !== 'all' || priceFilter !== 'all' || timeFilter !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setIndustryFilter('all');
    setStageFilter('all');
    setPriceFilter('all');
    setTimeFilter('all');
    setSortBy('relevant');
  };

  const renderActiveFilters = () => {
    const filters = [];
    if (searchQuery) {
      filters.push(
        <Badge key="search" variant="secondary" className="gap-1">
          Search: {searchQuery}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
        </Badge>
      );
    }
    if (industryFilter !== 'all') {
      filters.push(
        <Badge key="industry" variant="secondary" className="gap-1">
          Industry: {industryFilter}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setIndustryFilter('all')} />
        </Badge>
      );
    }
    if (stageFilter !== 'all') {
      filters.push(
        <Badge key="stage" variant="secondary" className="gap-1">
          Stage: {stageFilter}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setStageFilter('all')} />
        </Badge>
      );
    }
    if (priceFilter !== 'all') {
      filters.push(
        <Badge key="price" variant="secondary" className="gap-1">
          Price: {priceFilter}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceFilter('all')} />
        </Badge>
      );
    }
    return filters;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-xl p-4 border border-gray-100/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              placeholder="Search AI products..."
              value={localSearchQuery}
              onChange={(e) => {
                setLocalSearchQuery(e.target.value);
                console.log('Search input changed:', e.target.value);
              }}
              className="pl-10 bg-gray-50/50 border-gray-200/50 focus:border-primary/50 focus:ring-primary/50"
              disabled={isLoading}
            />
            {isLoading ? (
              <Loader2 className="absolute left-3 top-3 h-4 w-4 text-gray-400 animate-spin" />
            ) : (
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            )}
          </div>
          
          <div className="hidden md:flex gap-2 flex-wrap">
            <FilterSection
              label="Industry"
              value={industryFilter}
              onValueChange={setIndustryFilter}
              options={industries}
              disabled={isLoading}
            />

            <FilterSection
              label="Stage"
              value={stageFilter}
              onValueChange={setStageFilter}
              options={stages}
              disabled={isLoading}
            />

            <FilterSection
              label="Price Range"
              value={priceFilter}
              onValueChange={setPriceFilter}
              options={priceRanges}
              disabled={isLoading}
            />

            <FilterSection
              label="Sort by"
              value={sortBy}
              onValueChange={setSortBy}
              options={sortOptions}
              disabled={isLoading}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden" disabled={isLoading}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with these filters
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <FilterSection
                  label="Industry"
                  value={industryFilter}
                  onValueChange={setIndustryFilter}
                  options={industries}
                  disabled={isLoading}
                />

                <FilterSection
                  label="Stage"
                  value={stageFilter}
                  onValueChange={setStageFilter}
                  options={stages}
                  disabled={isLoading}
                />

                <FilterSection
                  label="Price Range"
                  value={priceFilter}
                  onValueChange={setPriceFilter}
                  options={priceRanges}
                  disabled={isLoading}
                />

                <FilterSection
                  label="Sort by"
                  value={sortBy}
                  onValueChange={setSortBy}
                  options={sortOptions}
                  disabled={isLoading}
                />
              </div>
            </SheetContent>
          </Sheet>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="hidden md:flex items-center gap-2"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {renderActiveFilters()}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="md:hidden"
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};