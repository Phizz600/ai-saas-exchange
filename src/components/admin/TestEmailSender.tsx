
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendTestEmail } from "@/integrations/supabase/functions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const TestEmailSender = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendTestEmail = async () => {
    setIsSending(true);
    setError(null);
    
    try {
      console.log("Attempting to send test email...");
      const response = await sendTestEmail();
      
      console.log("Email send response:", response);
      
      toast({
        title: "Test email sent!",
        description: `Email sent to ${response.to} (${response.firstName}, ${response.userType})`,
      });
    } catch (err: any) {
      console.error("Error in test email function:", err);
      
      const errorMessage = err?.message || "An unexpected error occurred";
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Failed to send email",
        description: errorMessage,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="font-semibold mb-4 text-lg">Send Test Email</h2>
      <p className="text-gray-600 mb-4">
        This will send a welcome email to the most recent user who signed up.
      </p>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2 text-xs">
              <p>Check that the Edge Function is deployed properly in your Supabase project.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleSendTestEmail} 
        disabled={isSending}
        className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
      >
        {isSending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Test Email"
        )}
      </Button>
    </div>
  );
};
