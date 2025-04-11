
import { useState, useEffect } from "react";
import { createEscrowTransaction } from "@/integrations/supabase/escrow";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAuctionEnd({
  auctionEndTime,
  productId,
  conversationId,
  currentPrice,
  productTitle
}: {
  auctionEndTime?: string;
  productId: string; 
  conversationId?: string;
  currentPrice?: number;
  productTitle?: string;
}) {
  const [isEnded, setIsEnded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEscrowCreated, setIsEscrowCreated] = useState(false);
  const [timeline, setTimeline] = useState("30 days");
  const { toast } = useToast();

  // Fetch the product timeline if available
  useEffect(() => {
    if (!productId) return;
    
    const fetchProductTimeline = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('investment_timeline')
          .eq('id', productId)
          .single();
          
        if (!error && data && data.investment_timeline) {
          setTimeline(data.investment_timeline);
        }
      } catch (error) {
        console.error("Error fetching product timeline:", error);
      }
    };
    
    fetchProductTimeline();
  }, [productId]);

  // Check if auction has ended
  useEffect(() => {
    if (!auctionEndTime) return;
    
    const checkIfEnded = () => {
      const now = new Date();
      const end = new Date(auctionEndTime);
      if (end <= now && !isEnded) {
        setIsEnded(true);
      }
    };
    
    // Check immediately
    checkIfEnded();
    
    // And then every minute
    const interval = setInterval(checkIfEnded, 60000);
    return () => clearInterval(interval);
  }, [auctionEndTime, isEnded]);

  // Create escrow proposal when auction ends
  useEffect(() => {
    const initiateEscrowProposal = async () => {
      // Only proceed if all required data is available and we haven't already processed
      if (!isEnded || isProcessing || isEscrowCreated || !conversationId || !currentPrice || !productTitle) {
        return;
      }
      
      try {
        setIsProcessing(true);
        
        // Create an escrow transaction proposal
        await createEscrowTransaction(
          conversationId,
          currentPrice,
          `Purchase of auction item: ${productTitle}`,
          timeline // Use the timeline from product or default
        );
        
        // Mark as created
        setIsEscrowCreated(true);
        
        // Send a detailed message to the conversation
        try {
          await supabase
            .from('messages')
            .insert({
              conversation_id: conversationId,
              sender_id: 'system', // You may need to adjust this based on your system
              content: `🔒 **Escrow Transaction Proposal Created**\n\nAmount: $${currentPrice.toLocaleString()}\nItem: ${productTitle}\nTimeline: ${timeline}\n\nAn escrow transaction has been automatically created based on the winning auction bid. Please review the details in the Escrow section above.`
            });
        } catch (msgError) {
          console.error("Error adding escrow message to conversation:", msgError);
        }
        
        // Notify the user
        toast({
          title: "Escrow Proposal Created",
          description: "An escrow transaction has been proposed for the completed auction.",
        });
        
      } catch (error) {
        console.error("Error creating escrow proposal:", error);
        toast({
          title: "Escrow Proposal Failed",
          description: "There was an issue creating the escrow proposal. Please try manually.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    initiateEscrowProposal();
  }, [isEnded, isProcessing, isEscrowCreated, conversationId, currentPrice, productTitle, toast, timeline]);
  
  return {
    isAuctionEnded: isEnded,
    isEscrowProposalCreated: isEscrowCreated,
    isProcessingEscrow: isProcessing
  };
}
