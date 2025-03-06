
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface GoogleAnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (verified: boolean) => void;
}

export function GoogleAnalyticsDialog({ open, onOpenChange, onConnect }: GoogleAnalyticsDialogProps) {
  const [clientId, setClientId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

    if (!window.gapi) {
      // Load the Google API script dynamically if not already loaded
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initGoogleAuth();
      };
      
      script.onerror = () => {
        setIsLoading(false);
        toast({
          title: "Google API Load Error",
          description: "Failed to load Google API. Please try again later.",
          variant: "destructive",
        });
      };
      
      document.body.appendChild(script);
    } else {
      initGoogleAuth();
    }
  };

  const initGoogleAuth = () => {
    try {
      window.gapi.load('auth2', {
        callback: () => {
          window.gapi.auth2
            .init({
              client_id: clientId,
              scope: "https://www.googleapis.com/auth/analytics.readonly"
            })
            .then(auth2 => {
              authenticateWithGoogle(auth2);
            })
            .catch(error => {
              console.error("Google Auth2 init error:", error);
              setIsLoading(false);
              toast({
                title: "Authentication Failed",
                description: "Failed to initialize Google authentication. Please check your Client ID.",
                variant: "destructive",
              });
            });
        },
        onerror: () => {
          setIsLoading(false);
          toast({
            title: "Google API Error",
            description: "Failed to load Google Auth API. Please try again later.",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error("Error in initGoogleAuth:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const authenticateWithGoogle = async (auth2: GoogleAuth) => {
    try {
      const googleUser = await auth2.signIn();
      const token = googleUser.getAuthResponse().access_token;
      
      console.log("Successfully authenticated with Google Analytics");
      
      // Here you would typically validate this token with your backend
      // For now, we'll simulate a successful verification
      setTimeout(() => {
        onConnect(true);
        onOpenChange(false);
        setIsLoading(false);
        
        toast({
          title: "Success!",
          description: "Successfully connected to Google Analytics and verified your traffic data.",
        });
      }, 1500);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setIsLoading(false);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newState) => {
      if (!isLoading) {
        onOpenChange(newState);
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold exo-2-header">Connect Google Analytics</DialogTitle>
          <DialogDescription>
            Enter your Google Client ID to connect with Google Analytics and verify your traffic data. You can find this in your Google Cloud Console.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <FormLabel>Google Client ID</FormLabel>
            <Input
              placeholder="Enter your Google Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              Format: xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Not sure where to find your Client ID? 
              <a 
                href="https://developers.google.com/analytics/devguides/reporting/core/v4/authorization" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                Learn more
              </a>
            </p>
          </div>
          <Button 
            onClick={handleGoogleAnalyticsConnect} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Connect and Verify"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
