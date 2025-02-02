import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface GoogleAnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (verified: boolean) => void;
}

export function GoogleAnalyticsDialog({ open, onOpenChange, onConnect }: GoogleAnalyticsDialogProps) {
  const [clientId, setClientId] = useState("");
  const { toast } = useToast();

  const handleGoogleAnalyticsConnect = async () => {
    if (!clientId) {
      toast({
        title: "Client ID Required",
        description: "Please enter your Google Client ID to connect.",
        variant: "destructive",
      });
      return;
    }

    if (!window.gapi) {
      toast({
        title: "Google API Not Loaded",
        description: "Please wait for the Google API to load and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const auth2 = await new Promise<GoogleAuth>((resolve, reject) => {
        window.gapi.load('auth2', {
          callback: () => {
            window.gapi.auth2
              .init({
                client_id: clientId,
                scope: "https://www.googleapis.com/auth/analytics.readonly"
              })
              .then(resolve)
              .catch(reject);
          },
          onerror: () => {
            reject(new Error('Failed to load auth2'));
          }
        });
      });

      const googleUser = await auth2.signIn();
      const token = googleUser.getAuthResponse().access_token;
      console.log("Successfully connected to Google Analytics", token);
      onConnect(true);
      onOpenChange(false);
      
      toast({
        title: "Success!",
        description: "Successfully connected to Google Analytics",
      });
    } catch (error) {
      console.error("Error connecting to Google Analytics:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Analytics. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Google Analytics</DialogTitle>
          <DialogDescription>
            Enter your Google Client ID to connect with Google Analytics. You can find this in your Google Cloud Console.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <FormLabel>Google Client ID</FormLabel>
            <Input
              placeholder="Enter your Google Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <Button onClick={handleGoogleAnalyticsConnect} className="w-full">
            Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}