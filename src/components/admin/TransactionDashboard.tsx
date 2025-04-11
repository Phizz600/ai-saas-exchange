
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('buyers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Fetch all escrow transactions with related product, buyer, and seller info
        const { data, error } = await supabase
          .from('escrow_transactions')
          .select(`
            id,
            status,
            amount,
            platform_fee,
            escrow_fee,
            created_at,
            updated_at,
            conversation_id,
            product:product_id (
              id,
              title,
              image_url
            ),
            buyer:buyer_id (
              id,
              full_name,
              email
            ),
            seller:seller_id (
              id,
              full_name,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Fetch transaction feedback
        const { data: feedback, error: feedbackError } = await supabase
          .from('transaction_feedback')
          .select('*');
        
        if (feedbackError) throw feedbackError;
        
        // Add feedback to transactions
        const transactionsWithFeedback = (data || []).map(tx => {
          const txFeedback = (feedback || []).filter(f => f.transaction_id === tx.id);
          return {
            ...tx,
            feedback: txFeedback,
            buyerFeedback: txFeedback.find(f => f.user_role === 'buyer'),
            sellerFeedback: txFeedback.find(f => f.user_role === 'seller')
          };
        });
        
        setTransactions(transactionsWithFeedback);
        setFilteredTransactions(transactionsWithFeedback);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions when search query or tab changes
    if (!searchQuery) {
      setFilteredTransactions(transactions);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredTransactions(
        transactions.filter(tx => 
          tx.product?.title?.toLowerCase().includes(query) ||
          tx.buyer?.full_name?.toLowerCase().includes(query) ||
          tx.seller?.full_name?.toLowerCase().includes(query) ||
          tx.id.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, transactions, selectedTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'funds_released':
        return 'bg-green-100 text-green-800';
      case 'payment_pending':
      case 'payment_received':
      case 'agreement_reached':
        return 'bg-blue-100 text-blue-800';
      case 'inspection_period':
      case 'payment_secured':
      case 'delivery_in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Transaction Dashboard</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buyers" onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="buyers">Buyer Transactions</TabsTrigger>
            <TabsTrigger value="sellers">Seller Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buyers" className="space-y-4">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Feedback</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map(tx => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div className="font-medium">{tx.product?.title || 'Unknown Product'}</div>
                            <div className="text-xs text-muted-foreground">{tx.id.substring(0, 8)}...</div>
                          </TableCell>
                          <TableCell>{tx.seller?.full_name || 'Unknown Seller'}</TableCell>
                          <TableCell>{formatCurrency(tx.amount)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(tx.status)}>
                              {formatStatus(tx.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(tx.created_at)}</TableCell>
                          <TableCell>
                            {tx.buyerFeedback ? (
                              <div className="flex items-center">
                                <div className="text-sm font-medium">{tx.buyerFeedback.rating}/5</div>
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">No feedback</div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sellers" className="space-y-4">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Feedback</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map(tx => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div className="font-medium">{tx.product?.title || 'Unknown Product'}</div>
                            <div className="text-xs text-muted-foreground">{tx.id.substring(0, 8)}...</div>
                          </TableCell>
                          <TableCell>{tx.buyer?.full_name || 'Unknown Buyer'}</TableCell>
                          <TableCell>{formatCurrency(tx.amount)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(tx.status)}>
                              {formatStatus(tx.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(tx.created_at)}</TableCell>
                          <TableCell>
                            {tx.sellerFeedback ? (
                              <div className="flex items-center">
                                <div className="text-sm font-medium">{tx.sellerFeedback.rating}/5</div>
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">No feedback</div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
