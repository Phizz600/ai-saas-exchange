
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export const FormSubmissionSuccess = () => {
  return (
    <Alert className="mb-6 bg-green-50 border-green-200">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>Your product has been submitted successfully. Redirecting to confirmation page...</p>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-progress rounded-full"></div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
