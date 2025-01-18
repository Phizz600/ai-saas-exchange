import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const CategoriesOverview = () => {
  const { categoriesOverview } = useMarketplaceProducts({
    searchQuery: "",
    industryFilter: "all",
    stageFilter: "all",
    priceFilter: "all",
    timeFilter: "all",
    sortBy: "relevant",
    currentPage: 1,
  });

  return (
    <Card className="p-4 mb-6 bg-white/80 backdrop-blur-xl shadow-lg border border-gray-100/50">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categoriesOverview.map(({ name, count }) => (
          <Badge
            key={name}
            variant="secondary"
            className="px-3 py-1 bg-gray-100/80 hover:bg-gray-200/80 cursor-pointer transition-colors"
          >
            {name} ({count})
          </Badge>
        ))}
      </div>
    </Card>
  );
};