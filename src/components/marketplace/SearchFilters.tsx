import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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

const industries = [
  "Content Generation",
  "Customer Service",
  "Image Generation",
  "Development Tools",
  "Audio Processing",
  "Finance",
  "Video Processing"
];

const stages = ["MVP", "Revenue", "Pre-Revenue", "Beta"];

const priceRanges = [
  "$0 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000+"
];

const sortOptions = [
  { value: "relevant", label: "Most Relevant" },
  { value: "price_asc", label: "Lowest Price" },
  { value: "price_desc", label: "Highest Price" },
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
];

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
  isLoading = false,
}: SearchFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [debouncedSearchQuery] = useDebounce(localSearchQuery, 300);
  const { toast } = useToast();

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
            <Select value={industryFilter} onValueChange={setIndustryFilter} disabled={isLoading}>
              <SelectTrigger className="w-[140px] bg-gray-50/50 border-gray-200/50">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="all" className="hover:bg-gray-50">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem 
                    key={industry} 
                    value={industry.toLowerCase()}
                    className="hover:bg-gray-50"
                  >
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[140px] bg-gray-50/50 border-gray-200/50">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              <SelectItem value="all" className="hover:bg-gray-50">All Stages</SelectItem>
              {stages.map((stage) => (
                <SelectItem 
                  key={stage} 
                  value={stage.toLowerCase()}
                  className="hover:bg-gray-50"
                >
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-[140px] bg-gray-50/50 border-gray-200/50">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              <SelectItem value="all" className="hover:bg-gray-50">All Prices</SelectItem>
              {priceRanges.map((range) => (
                <SelectItem 
                  key={range} 
                  value={range.toLowerCase()}
                  className="hover:bg-gray-50"
                >
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] bg-gray-50/50 border-gray-200/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              {sortOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-gray-50"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry.toLowerCase()}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage.toLowerCase()}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  {priceRanges.map((range) => (
                    <SelectItem key={range} value={range.toLowerCase()}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
