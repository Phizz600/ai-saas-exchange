
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendTestEmail } from "@/integrations/supabase/functions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export const TestEmailSender = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);
  const { toast } = useToast();

  const handleSendTestEmail = async () => {
    setIsSending(true);
    setError(null);
    setDebugInfo(null);
    setSuccess(null);
    
    try {
      console.log("Attempting to send test email...");
      const response = await sendTestEmail();
      
      console.log("Email send response:", response);
      setSuccess(response);
      
      toast({
        title: "Test email sent!",
        description: `Email sent to ${response.to} (${response.firstName}, ${response.userType})`,
      });
    } catch (err: any) {
      console.error("Error in test email function:", err);
      
      const errorMessage = err?.message || "An unexpected error occurred";
      setError(errorMessage);
      
      // Store any additional error information for debugging
      if (err?.response) {
        try {
          const responseData = await err.response.json();
          setDebugInfo(responseData);
          console.log("Error response data:", responseData);
        } catch (parseErr) {
          console.log("Could not parse error response:", parseErr);
        }
      }
      
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
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Send Test Email</CardTitle>
        <CardDescription>
          This will send a welcome email to the most recent user who signed up.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2 text-xs space-y-1">
                <p>Please check that:</p>
                <ul className="list-disc pl-5">
                  <li>The Resend API key is configured correctly in Supabase secrets</li>
                  <li>The API key is valid and not expired</li>
                  <li>You have verified your domain in Resend if you're using a custom sender</li>
                  <li>Required secrets (RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are configured</li>
                  <li>There are users in your database</li>
                </ul>
              </div>
              
              {debugInfo && (
                <div className="mt-2 p-2 bg-gray-800 text-white rounded text-xs overflow-auto max-h-40">
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertTitle className="text-green-700">Success</AlertTitle>
            <AlertDescription className="text-green-600">
              <p>Email sent successfully!</p>
              <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-xs overflow-auto max-h-40">
                <pre>{JSON.stringify(success, null, 2)}</pre>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
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
        
        {error && (
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="ml-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
