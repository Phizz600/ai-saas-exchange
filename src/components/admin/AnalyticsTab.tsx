
import { TransactionAnalytics } from "./TransactionAnalytics";
import { EscrowAnalytics } from "./EscrowAnalytics";
import { UserBehaviorAnalytics } from "./UserBehaviorAnalytics";
import { TransactionDashboard } from "./TransactionDashboard";
import { SiteAnalytics } from "./SiteAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="site" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="site">Site Performance</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Metrics</TabsTrigger>
          <TabsTrigger value="escrow">Escrow Process</TabsTrigger>
          <TabsTrigger value="users">User Behavior</TabsTrigger>
          <TabsTrigger value="dashboard">Transaction History</TabsTrigger>
        </TabsList>
        
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
