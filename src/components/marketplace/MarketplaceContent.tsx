import { useState, useEffect } from "react";
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { CategoriesOverview } from "@/components/marketplace/CategoriesOverview";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockProducts } from "@/data/mockProducts";

export const MarketplaceContent = () => {
  useEffect(() => {
    console.log('MarketplaceContent mounted');
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  // For now, we'll use mock data directly instead of the hook
  const currentItems = mockProducts;
  const totalPages = 1;
  const isLoading = false;
  const error = null;

  useEffect(() => {
    // Enhanced analytics tracking
    console.log('Analytics: Marketplace page viewed', {
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }, []);

  useEffect(() => {
    // Enhanced filter change tracking
    console.log('Analytics: Filters changed', {
      timestamp: new Date().toISOString(),
      searchQuery,
      industryFilter,
      stageFilter,
      priceFilter,
      timeFilter,
      sortBy,
      currentPage,
      resultsCount: currentItems.length,
    });
  }, [searchQuery, industryFilter, stageFilter, priceFilter, timeFilter, sortBy, currentPage, currentItems.length]);

  if (error) {
    console.error('MarketplaceContent error:', error);
    toast({
      variant: "destructive",
      title: "Error loading products",
      description: "Please try again later.",
    });

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was an error loading the marketplace products. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <CategoriesOverview />
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

      <ProductGrid products={currentItems} isLoading={isLoading} />

      {!isLoading && currentItems.length > 0 && (
        <MarketplacePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};