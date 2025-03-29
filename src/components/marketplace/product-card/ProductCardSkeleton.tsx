
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full border-gray-100/50">
      <div className="relative h-48">
        <Skeleton className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300" />
        <div className="absolute top-2 right-2 flex gap-1">
          <Skeleton className="h-8 w-8 rounded-md bg-white/20" />
          <Skeleton className="h-8 w-8 rounded-md bg-white/20" />
        </div>
        <div className="absolute top-2 left-2">
          <Skeleton className="h-6 w-24 rounded-full bg-green-400/20" />
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-3/4 bg-gray-200" />
        <Skeleton className="h-4 w-full bg-gray-200" />
        <Skeleton className="h-4 w-5/6 bg-gray-200" />
        
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full bg-green-200" />
            <Skeleton className="h-5 w-24 bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full bg-blue-200" />
            <Skeleton className="h-5 w-28 bg-gray-200" />
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20 rounded-full bg-purple-200" />
          <Skeleton className="h-6 w-16 rounded-full bg-blue-200" />
        </div>
      </div>
    </Card>
  );
}
