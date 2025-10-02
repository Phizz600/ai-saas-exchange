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
  deal_status: string | null;
  conversation_id: string;
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

      // Map conversations to deals with engagement status
      const deals = (conversations || []).map((conv: any) => {
        // Map old escrow_status to new deal_status for backward compatibility
        let dealStatus = 'viewed'; // Default status
        
        if (conv.escrow_status) {
          // If there's an escrow status, map it to engagement stages
          if (conv.escrow_status === 'payment_secured' || conv.escrow_status === 'delivery_in_progress') {
            dealStatus = 'call_scheduled';
          } else if (conv.escrow_status === 'inspection_period') {
            dealStatus = 'due_diligence';
          } else if (conv.escrow_status === 'completed') {
            dealStatus = 'deal_closed';
          }
        }

        return {
          id: conv.id,
          product_id: conv.product_id,
          product_title: conv.products?.title || 'Unknown Product',
          buyer_id: conv.buyer_id,
          seller_id: conv.seller_id,
          buyer_name: conv.buyer_profile?.full_name || 'Unknown Buyer',
          seller_name: conv.seller_profile?.full_name || 'Unknown Seller',
          amount: conv.products?.price || 0,
          deal_status: dealStatus,
          conversation_id: conv.id,
          created_at: conv.created_at,
          is_buyer: userRole === 'buyer'
        };
      });

      return deals;
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
    deal_status: 'call_scheduled',
    conversation_id: 'example-conversation',
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
                  ? "You haven't requested any introductions yet. Browse listings and connect with sellers!"
                  : "No active buyer engagements in your pipeline. Buyers interested in your listings will appear here."
                }
              </p>
              <p className="text-sm text-muted-foreground/80 mb-6">
                Here's what buyer engagement tracking looks like:
              </p>
            </CardContent>
          </Card>
          
          {/* Example Deal */}
          <div className="relative">
            <div className="absolute -top-2 left-4 bg-background px-2 py-1 text-xs text-foreground border rounded">
              Example Deal
            </div>
            <div>
              <DealCard deal={exampleDeal} isExample={true} />
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