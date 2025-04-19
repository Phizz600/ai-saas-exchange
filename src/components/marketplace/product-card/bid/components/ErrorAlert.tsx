
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  error: string | null;
  type?: 'payment' | 'bid';
}

export function ErrorAlert({ error, type = 'bid' }: ErrorAlertProps) {
  if (!error) return null;
  
  const message = type === 'payment' ? 
    `Payment error: ${error}. Please try again with a different payment method.` : 
    error;
  
  return (
    <Alert variant="destructive" className="mb-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
