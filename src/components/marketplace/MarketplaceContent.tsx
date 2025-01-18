import { useState } from "react";
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";

export const MarketplaceContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { currentItems, totalPages } = useMarketplaceProducts({
    searchQuery,
    industryFilter,
    stageFilter,
    priceFilter,
    timeFilter,
    sortBy,
    currentPage,
  });

  return (
    <>
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
      />

      <ProductGrid products={currentItems} />

      <MarketplacePagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};