import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TrafficSectionProps {
  form: UseFormReturn<ListProductFormData>;
}

export function TrafficSection({ form }: TrafficSectionProps) {
  const handleGoogleAnalyticsConnect = async () => {
    // Initialize Google Sign-in
    const clientId = "YOUR_GOOGLE_CLIENT_ID"; // This should be provided by user during runtime
    const scope = "https://www.googleapis.com/auth/analytics.readonly";
    
    // @ts-ignore - window.gapi will be loaded during runtime
    const auth2 = window.gapi.auth2.getAuthInstance();
    
    try {
      const googleUser = await auth2.signIn();
      const token = googleUser.getAuthResponse().access_token;
      console.log("Successfully connected to Google Analytics", token);
      form.setValue("isGoogleAnalyticsVerified", true);
    } catch (error) {
      console.error("Error connecting to Google Analytics:", error);
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
            onClick={handleGoogleAnalyticsConnect}
            className="w-full md:w-auto"
          >
            Connect Google Analytics
          </Button>
        )}
      </div>
    </div>
  );
}