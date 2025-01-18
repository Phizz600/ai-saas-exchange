import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
}: SearchFiltersProps) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="relative">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="bg-[#f3f3f3]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry.toLowerCase()}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="bg-[#f3f3f3]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage.toLowerCase()}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="bg-[#f3f3f3]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="all">All Prices</SelectItem>
            {priceRanges.map((range) => (
              <SelectItem key={range} value={range.toLowerCase()}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="bg-[#f3f3f3]">
            <SelectValue placeholder="Time Left" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="all">All Auctions</SelectItem>
            <SelectItem value="ending-soon">Ending Soon (24h)</SelectItem>
            <SelectItem value="1-3-days">1-3 Days</SelectItem>
            <SelectItem value="3-7-days">3-7 Days</SelectItem>
            <SelectItem value="7-plus-days">7+ Days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="bg-[#f3f3f3]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};