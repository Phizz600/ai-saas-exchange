
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export const TransactionAnalytics = () => {
  const [transactionData, setTransactionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D946EE', '#8B5CF6'];

  useEffect(() => {
    const fetchTransactionData = async () => {
      setLoading(true);
      try {
        // Fetch overall statistics about escrow transactions
        const { data: transactions, error } = await supabase
          .from('escrow_transactions')
          .select(`
            id,
            created_at,
            updated_at,
            status,
            amount,
            product:product_id (title)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Process data for analytics
        const stats = processTransactionData(transactions || []);
        setTransactionData(stats);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [selectedTimeframe]);

  const processTransactionData = (transactions: any[]) => {
    // Filter transactions based on selected timeframe
    const now = new Date();
    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.created_at);
      if (selectedTimeframe === 'week') {
        return (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24) <= 7;
      } else if (selectedTimeframe === 'month') {
        return (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24) <= 30;
      } else if (selectedTimeframe === 'quarter') {
        return (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24) <= 90;
      }
      return true; // All time
    });

    // Calculate completion rates
    const statusCounts: {[key: string]: number} = {};
    filtered.forEach(tx => {
      statusCounts[tx.status] = (statusCounts[tx.status] || 0) + 1;
    });

    // Calculate average time to complete
    const completedTransactions = filtered.filter(tx => 
      tx.status === 'funds_released' || tx.status === 'completed'
    );
    
    let avgCompletionTime = 0;
    if (completedTransactions.length > 0) {
      const completionTimes = completedTransactions.map(tx => {
        const startDate = new Date(tx.created_at);
        const endDate = new Date(tx.updated_at);
        return (endDate.getTime() - startDate.getTime()) / (1000 * 3600); // hours
      });
      avgCompletionTime = completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length;
    }

    // Format data for charts
    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: formatStatus(status),
      value: count
    }));

    return {
      totalTransactions: filtered.length,
      completedTransactions: completedTransactions.length,
      completionRate: filtered.length > 0 ? (completedTransactions.length / filtered.length) * 100 : 0,
      avgCompletionTime,
      statusData,
      recentTransactions: filtered.slice(0, 5)
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
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Transaction Analytics</CardTitle>
          <TabsList>
            <TabsTrigger 
              value="week" 
              onClick={() => setSelectedTimeframe('week')}
              className={selectedTimeframe === 'week' ? 'bg-primary text-primary-foreground' : ''}
            >
              Last Week
            </TabsTrigger>
            <TabsTrigger 
              value="month" 
              onClick={() => setSelectedTimeframe('month')}
              className={selectedTimeframe === 'month' ? 'bg-primary text-primary-foreground' : ''}
            >
              Last Month
            </TabsTrigger>
            <TabsTrigger 
              value="quarter" 
              onClick={() => setSelectedTimeframe('quarter')}
              className={selectedTimeframe === 'quarter' ? 'bg-primary text-primary-foreground' : ''}
            >
              Last Quarter
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              onClick={() => setSelectedTimeframe('all')}
              className={selectedTimeframe === 'all' ? 'bg-primary text-primary-foreground' : ''}
            >
              All Time
            </TabsTrigger>
          </TabsList>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-md" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-[100px] rounded-md" />
              <Skeleton className="h-[100px] rounded-md" />
              <Skeleton className="h-[100px] rounded-md" />
            </div>
          </div>
        ) : transactionData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{transactionData.totalTransactions}</div>
                    <div className="text-sm text-muted-foreground">Total Transactions</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{transactionData.completionRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{transactionData.avgCompletionTime.toFixed(1)} hrs</div>
                    <div className="text-sm text-muted-foreground">Avg. Time to Complete</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={transactionData.statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {transactionData.statusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactionData.recentTransactions.map((tx: any) => (
                      <div key={tx.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{tx.product?.title || 'Unknown Product'}</div>
                          <div className="text-sm text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                            {formatStatus(tx.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No transaction data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
