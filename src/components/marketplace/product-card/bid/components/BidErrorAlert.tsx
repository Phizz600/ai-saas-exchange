
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BidErrorAlertProps {
  bidError: string | null;
}

export function BidErrorAlert({ bidError }: BidErrorAlertProps) {
  if (!bidError) return null;
  
  return (
    <Alert variant="destructive" className="mb-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{bidError}</AlertDescription>
    </Alert>
  );
}
