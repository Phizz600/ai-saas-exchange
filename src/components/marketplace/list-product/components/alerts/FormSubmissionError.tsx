
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FormSubmissionErrorProps {
  error: string;
  onClear: () => void;
  onSaveForLater: () => void;
}

export const FormSubmissionError = ({ error, onClear, onSaveForLater }: FormSubmissionErrorProps) => {
  return (
    <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Submission Failed</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>{error}</p>
        <div className="mt-4 space-x-4">
          <Button 
            onClick={onClear} 
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => {
              onSaveForLater();
              toast.success("Progress saved. You can return to this later.");
            }}
            variant="ghost"
          >
            Save for Later
          </Button>
          <Button 
            onClick={() => {
              window.open("https://calendly.com/aiexchangeclub/listing-walkthrough", "_blank");
            }}
            variant="default"
          >
            Get Help
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
