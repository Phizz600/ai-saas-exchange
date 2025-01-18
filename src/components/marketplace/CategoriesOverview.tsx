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
    <Card className="p-6 mb-6 bg-accent text-white shadow-lg border-0">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categoriesOverview.map(({ name, count }) => (
          <Badge
            key={name}
            variant="secondary"
            className="px-4 py-2 bg-accent2 hover:bg-accent3 text-white cursor-pointer transition-colors text-sm font-medium"
          >
            {name} ({count})
          </Badge>
        ))}
      </div>
    </Card>
  );
};