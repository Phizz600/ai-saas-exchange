
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorMessageProps {
  errorMessage: string;
}

export const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => {
  if (!errorMessage) return null;
  
  return (
    <Alert variant="destructive" className="mb-4 bg-red-50/90 backdrop-blur-sm border border-red-200">
      <AlertDescription className="font-medium">{errorMessage}</AlertDescription>
    </Alert>
  );
};
