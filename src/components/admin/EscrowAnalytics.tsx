
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const EscrowAnalytics = () => {
  const [escrowData, setEscrowData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEscrowData = async () => {
      setLoading(true);
      try {
        // Fetch escrow transactions with failure points
        const { data: transactions, error } = await supabase
          .from('escrow_transactions')
          .select(`
            id,
            status,
            created_at,
            updated_at,
            timeline
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Process data for failure analysis
        const stats = processEscrowData(transactions || []);
        setEscrowData(stats);
      } catch (error) {
        console.error('Error fetching escrow data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEscrowData();
  }, []);

  const processEscrowData = (transactions: any[]) => {
    // Count transactions by status
    const statusCounts: {[key: string]: number} = {};
    transactions.forEach(tx => {
      statusCounts[tx.status] = (statusCounts[tx.status] || 0) + 1;
    });

    // Identify failure points (transactions stuck in a status for more than 7 days)
    const now = new Date();
    const failurePoints = transactions.filter(tx => {
      // Check if transaction is not in a completed/failed state
      if (tx.status === 'funds_released' || tx.status === 'completed' || 
          tx.status === 'cancelled' || tx.status === 'rejected') {
        return false;
      }
      
      // Check if it's been stuck for a while
      const updatedDate = new Date(tx.updated_at);
      const daysSinceUpdate = (now.getTime() - updatedDate.getTime()) / (1000 * 3600 * 24);
      return daysSinceUpdate > 7;
    });

    // Calculate average time spent in each status
    const statusDurations: {[key: string]: {total: number, count: number}} = {};
    
    // Prepare data for charts
    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: formatStatus(status),
      count
    }));
    
    // Sort by number of transactions
    statusData.sort((a, b) => b.count - a.count);

    return {
      totalTransactions: transactions.length,
      statusData,
      failurePoints,
      // Identify top 3 problem areas
      topFailureStatuses: Object.entries(statusCounts)
        .filter(([status]) => status !== 'funds_released' && status !== 'completed')
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([status, count]) => ({ 
          status: formatStatus(status), 
          count,
          percentage: (count / transactions.length * 100).toFixed(1)
        }))
    };
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Escrow Process Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-md" />
            <Skeleton className="h-[100px] w-full rounded-md" />
          </div>
        ) : escrowData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {escrowData.topFailureStatuses.map((item: any, index: number) => (
                <Card key={index} className={index === 0 ? "border-red-400" : ""}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-xl font-bold">{item.status}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.count} transactions ({item.percentage}%)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={escrowData.statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8B5CF6" name="Transactions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {escrowData.failurePoints.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Stalled Transactions Detected</AlertTitle>
                <AlertDescription>
                  There are {escrowData.failurePoints.length} transactions that have been stuck in the same status for over 7 days.
                  Consider reaching out to the involved parties.
                </AlertDescription>
              </Alert>
            )}
            
            {escrowData.failurePoints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stalled Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escrowData.failurePoints.slice(0, 5).map((tx: any) => (
                      <div key={tx.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">Transaction {tx.id.substring(0, 8)}...</div>
                          <div className="text-sm text-muted-foreground">
                            Created: {new Date(tx.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                            Stuck in {formatStatus(tx.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No escrow data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
