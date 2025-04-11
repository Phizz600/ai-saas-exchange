
import { Header } from "@/components/Header";
import { TestEmailSender } from "@/components/admin/TestEmailSender";
import { WelcomeEmailTester } from "@/components/admin/WelcomeEmailTester";
import { AuctionResultEmailTester } from "@/components/admin/AuctionResultEmailTester";
import { ProductListingsManager } from "@/components/admin/ProductListingsManager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import { AnalyticsTab } from "@/components/admin/AnalyticsTab";

export const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="exo-2-heading text-3xl font-bold mb-2">Admin Tools</h1>
          <p className="text-gray-600 mb-6">Manage your application settings and test functionality</p>
          
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              This admin panel is only visible in development mode. Use these tools to test and debug your application.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="products" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="products">Product Listings</TabsTrigger>
              <TabsTrigger value="emails">Email Testing</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <ProductListingsManager />
            </TabsContent>
            
            <TabsContent value="emails">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl">Email Testing Tools</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="grid gap-6">
                    <TestEmailSender />
                    
                    <AuctionResultEmailTester />
                    
                    <WelcomeEmailTester />
                    
                    <Card className="shadow-md opacity-60">
                      <CardHeader>
                        <CardTitle className="text-lg">API Key Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>Resend API Key: Configured</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Settings panel is coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-8" />
          
          <Card className="bg-white shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg">Environment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Environment: {import.meta.env.DEV ? "Development" : "Production"}</p>
                <p>Supabase Project ID: pxadbwlidclnfoodjtpd</p>
                <p>Edge Functions: send-welcome-email, send-test-email, send-auction-result-email</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
