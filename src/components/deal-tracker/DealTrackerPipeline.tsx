import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PipelineStage } from "./PipelineStage";
import { DealCard } from "./DealCard";
import { Loader2 } from "lucide-react";

interface Deal {
  id: string;
  product_id: string;
  product_title: string;
  buyer_id: string;
  seller_id: string;
  buyer_name: string;
  seller_name: string;
  amount: number;
  escrow_status: string | null;
  conversation_id: string;
  nda_signed: boolean;
  created_at: string;
  is_buyer: boolean;
}

interface DealTrackerPipelineProps {
  userRole: 'buyer' | 'seller';
}

export const DealTrackerPipeline = ({ userRole }: DealTrackerPipelineProps) => {
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deal-pipeline', userRole],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          id,
          product_id,
          buyer_id,
          seller_id,
          escrow_status,
          created_at,
          products (
            id,
            title,
            price
          ),
          escrow_transactions (
            id,
            amount,
            status,
            created_at
          ),
          buyer_profile:profiles!conversations_buyer_id_fkey (
            full_name
          ),
          seller_profile:profiles!conversations_seller_id_fkey (
            full_name
          )
        `)
        .or(userRole === 'buyer' ? `buyer_id.eq.${user.id}` : `seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check for NDAs for each conversation
      const dealsWithNDA = await Promise.all(
        (conversations || []).map(async (conv: any) => {
          const { data: nda } = await supabase
            .from('product_ndas')
            .select('id')
            .eq('product_id', conv.product_id)
            .eq('user_id', userRole === 'buyer' ? conv.buyer_id : conv.seller_id)
            .single();

          const escrowTransaction = conv.escrow_transactions?.[0];

          return {
            id: conv.id,
            product_id: conv.product_id,
            product_title: conv.products?.title || 'Unknown Product',
            buyer_id: conv.buyer_id,
            seller_id: conv.seller_id,
            buyer_name: conv.buyer_profile?.full_name || 'Unknown Buyer',
            seller_name: conv.seller_profile?.full_name || 'Unknown Seller',
            amount: escrowTransaction?.amount || conv.products?.price || 0,
            escrow_status: escrowTransaction?.status || conv.escrow_status,
            conversation_id: conv.id,
            nda_signed: !!nda,
            created_at: conv.created_at,
            is_buyer: userRole === 'buyer'
          };
        })
      );

      return dealsWithNDA;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading deals...</span>
        </CardContent>
      </Card>
    );
  }

  // Create example deal for empty state
  const exampleDeal: Deal = {
    id: 'example-deal',
    product_id: 'example-product',
    product_title: 'AI Content Generator SaaS',
    buyer_id: 'example-buyer',
    seller_id: 'example-seller',
    buyer_name: userRole === 'buyer' ? 'You' : 'Sarah Wilson',
    seller_name: userRole === 'seller' ? 'You' : 'John Smith',
    amount: 125000,
    escrow_status: 'payment_secured',
    conversation_id: 'example-conversation',
    nda_signed: true,
    created_at: new Date().toISOString(),
    is_buyer: userRole === 'buyer'
  };

  if (deals.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4 exo-2-header text-neutral-50">Deal Flow Pipeline</h2>
        <div className="space-y-4">
          <Card className="border-dashed border-2 border-muted-foreground/30">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {userRole === 'buyer' 
                  ? "You haven't initiated any deals yet. Start by making an offer on a listing!"
                  : "No active deals in your pipeline. Your deals will appear here once buyers start the acquisition process."
                }
              </p>
              <p className="text-sm text-muted-foreground/80 mb-6">
                Here's what a deal in progress would look like:
              </p>
            </CardContent>
          </Card>
          
          {/* Example Deal */}
          <div className="relative">
            <div className="absolute -top-2 left-4 bg-background px-2 py-1 text-xs text-muted-foreground border rounded">
              Example Deal
            </div>
            <div className="opacity-75">
              <DealCard deal={exampleDeal} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 exo-2-header text-neutral-50">Deal Flow Pipeline</h2>
      <Card>
        <CardContent className="space-y-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};