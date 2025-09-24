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

  if (deals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Deal Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {userRole === 'buyer' 
              ? "You haven't initiated any deals yet. Start by making an offer on a listing!"
              : "No active deals in your pipeline. Your deals will appear here once buyers start the acquisition process."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Deal Pipeline</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your {userRole === 'buyer' ? 'acquisition' : 'sale'} progress
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </CardContent>
    </Card>
  );
};