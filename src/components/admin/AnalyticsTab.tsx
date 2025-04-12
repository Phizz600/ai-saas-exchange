
import { TransactionAnalytics } from "./TransactionAnalytics";
import { EscrowAnalytics } from "./EscrowAnalytics";
import { UserBehaviorAnalytics } from "./UserBehaviorAnalytics";
import { TransactionDashboard } from "./TransactionDashboard";
import { SiteAnalytics } from "./SiteAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const AnalyticsTab = () => {
  const [activeTab, setActiveTab] = useState("site");
  const [loadError, setLoadError] = useState<string | null>(null);

  // Add analytics error tracking
  useEffect(() => {
    // Reset error when tab changes
    setLoadError(null);

    const handleError = (err: ErrorEvent) => {
      console.error("Analytics error detected:", err.message);
      setLoadError(`Error in analytics: ${err.message}`);
      
      toast.error("Analytics Error", {
        description: "There was a problem loading analytics data. Technical team has been notified.",
      });
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    console.log("Switching to analytics tab:", value);
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="site" 
        className="w-full" 
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="site">Site Performance</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Metrics</TabsTrigger>
          <TabsTrigger value="escrow">Escrow Process</TabsTrigger>
          <TabsTrigger value="users">User Behavior</TabsTrigger>
          <TabsTrigger value="dashboard">Transaction History</TabsTrigger>
        </TabsList>
        
        {loadError && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
            <p className="font-medium">Error loading analytics</p>
            <p className="text-sm">{loadError}</p>
            <button 
              onClick={() => setLoadError(null)}
              className="mt-2 text-xs underline"
            >
              Try Again
            </button>
          </div>
        )}
        
        <TabsContent value="site">
          <SiteAnalytics />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionAnalytics />
        </TabsContent>
        
        <TabsContent value="escrow">
          <EscrowAnalytics />
        </TabsContent>
        
        <TabsContent value="users">
          <UserBehaviorAnalytics />
        </TabsContent>
        
        <TabsContent value="dashboard">
          <TransactionDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
