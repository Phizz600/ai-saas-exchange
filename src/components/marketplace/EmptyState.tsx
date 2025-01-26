import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const EmptyState = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No Products Found</AlertTitle>
      <AlertDescription>
        There are currently no products listed in the marketplace. Be the first to list your AI product!
      </AlertDescription>
    </Alert>
  );
};