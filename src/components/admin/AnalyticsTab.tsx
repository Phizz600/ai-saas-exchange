
import { TransactionAnalytics } from "./TransactionAnalytics";
import { EscrowAnalytics } from "./EscrowAnalytics";
import { UserBehaviorAnalytics } from "./UserBehaviorAnalytics";
import { TransactionDashboard } from "./TransactionDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transaction Metrics</TabsTrigger>
          <TabsTrigger value="escrow">Escrow Process</TabsTrigger>
          <TabsTrigger value="users">User Behavior</TabsTrigger>
          <TabsTrigger value="dashboard">Transaction History</TabsTrigger>
        </TabsList>
        
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
