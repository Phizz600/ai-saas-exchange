
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendAuctionResultEmail, checkEndedAuctions } from "@/integrations/supabase/functions";

export const AuctionResultEmailTester = () => {
  const [productId, setProductId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendAuctionResultEmail = async () => {
    if (!productId.trim()) {
      toast({
        variant: "destructive",
        title: "Product ID Required",
        description: "Please enter a valid product ID to send the auction result email",
      });
      return;
    }

    setIsSending(true);
    setError(null);
    setResponse(null);
    
    try {
      const result = await sendAuctionResultEmail(productId);
      
      setResponse(result);
      toast({
        title: "Auction Result Email Sent",
        description: "The auction result email was triggered successfully using Resend",
      });
    } catch (err: any) {
      console.error("Error sending auction result email:", err);
      setError(err?.message || "An error occurred while sending the email");
      
      toast({
        variant: "destructive",
        title: "Failed to Send Email",
        description: err?.message || "An error occurred while sending the email",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleProcessEndedAuctions = async () => {
    setIsProcessing(true);
    setError(null);
    setResponse(null);
    
    try {
      const result = await checkEndedAuctions();
      
      setResponse(result);
      toast({
        title: "Auctions Processed",
        description: `Processed ${result.processed || 0} ended auctions successfully with Resend`,
      });
    } catch (err: any) {
      console.error("Error processing ended auctions:", err);
      setError(err?.message || "An error occurred while processing auctions");
      
      toast({
        variant: "destructive",
        title: "Failed to Process Auctions",
        description: err?.message || "An error occurred while processing ended auctions",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="exo-2-header text-lg bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-transparent bg-clip-text">Auction Result Email Tester</CardTitle>
        <CardDescription>
          Send auction result emails to test the notification flow with Resend
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            These tools help test the auction email notification system using Resend. You can either send an email for a specific product
            or check for all ended auctions.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="productId">Product ID (UUID)</Label>
          <Input 
            id="productId" 
            placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000" 
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the UUID of a product to send a test auction result email
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {response && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">
              <p className="font-semibold">Response:</p>
              <pre className="mt-2 text-xs overflow-auto bg-green-100 p-2 rounded">
                {JSON.stringify(response, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex space-x-4 w-full">
          <Button 
            onClick={handleSendAuctionResultEmail} 
            disabled={isSending}
            className="flex-1 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Auction Result Email"
            )}
          </Button>
        </div>
        
        <div className="w-full">
          <Button 
            onClick={handleProcessEndedAuctions} 
            disabled={isProcessing}
            variant="outline"
            className="w-full border-[#8B5CF6] text-[#8B5CF6]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Check & Process Ended Auctions"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
