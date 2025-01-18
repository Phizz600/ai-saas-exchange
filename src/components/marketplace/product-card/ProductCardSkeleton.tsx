import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-xl border-gray-100/50 shadow-lg">
      <div className="relative aspect-video">
        <Skeleton className="absolute inset-0" />
      </div>
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}