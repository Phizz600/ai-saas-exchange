
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const FormSubmissionTips = () => {
  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertTitle>Submission Tips</AlertTitle>
      <AlertDescription>
        <p>Please ensure all required fields are filled and that you have:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Uploaded a valid product image (JPG, PNG, or WebP format)</li>
          <li>Provided a unique product title</li>
          <li>Completed all required fields in each section</li>
          <li>Accepted the terms and agreements in the final section</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};
