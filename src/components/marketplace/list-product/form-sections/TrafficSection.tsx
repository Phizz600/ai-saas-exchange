import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrafficSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TrafficSection({ form }: TrafficSectionProps) {
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
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

    // Check if gapi is loaded
    if (!window.gapi) {
      toast({
        title: "Google API Not Loaded",
        description: "Please wait for the Google API to load and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Initialize Google Sign-in with proper error handling
      const auth2 = await new Promise((resolve, reject) => {
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
      form.setValue("isGoogleAnalyticsVerified", true);
      setShowGoogleDialog(false);
      
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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Traffic & Users</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="monthlyTraffic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Monthly Traffic
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Unique visitors or API calls per month</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter monthly visitors"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activeUsers"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Active Users
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Number of current active users</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter active users"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthlyChurnRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Monthly Churn Rate (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white">
                      <p>Percentage of customers that stop using your product each month</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter churn rate"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="isGoogleAnalyticsVerified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Verify traffic with Google Analytics (optional but recommended for higher buyer trust)
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {form.watch("isGoogleAnalyticsVerified") && (
          <Button
            type="button"
            onClick={() => setShowGoogleDialog(true)}
            className="w-full md:w-auto"
          >
            Connect Google Analytics
          </Button>
        )}
      </div>

      <Dialog open={showGoogleDialog} onOpenChange={setShowGoogleDialog}>
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
    </div>
  );
}
