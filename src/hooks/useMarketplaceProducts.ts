import { useMemo } from "react";
import { mockProducts } from "@/data/mockProducts";

interface UseMarketplaceProductsProps {
  searchQuery: string;
  industryFilter: string;
  stageFilter: string;
  priceFilter: string;
  timeFilter: string;
  sortBy: string;
  currentPage: number;
}

export const useMarketplaceProducts = ({
  sortBy,
  currentPage,
}: UseMarketplaceProductsProps) => {
  const itemsPerPage = 6;

  const getSortedProducts = () => {
    let sorted = [...mockProducts];
    switch (sortBy) {
      case "price_asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price_desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "recent":
        return sorted.sort((a, b) => {
          const getHours = (time: string) => {
            const [days, hours] = time.split(" ");
            return parseInt(days) * 24 + parseInt(hours);
          };
          return getHours(b.timeLeft) - getHours(a.timeLeft);
        });
      case "popular":
        // Simulated popularity based on monthly revenue
        return sorted.sort((a, b) => b.monthlyRevenue - a.monthlyRevenue);
      default:
        return sorted;
    }
  };

  const sortedProducts = useMemo(() => getSortedProducts(), [sortBy]);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Get categories overview
  const categoriesOverview = useMemo(() => {
    const categories = mockProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(categories).map(([name, count]) => ({ name, count }));
  }, []);

  return {
    currentItems,
    totalPages,
    isLoading: false,
    error: null as Error | null,
    categoriesOverview,
  };
};