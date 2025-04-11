
import { useState, useEffect } from "react";
import { createEscrowTransaction } from "@/integrations/supabase/escrow";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
          "30 days" // Default timeline
        );
        
        // Mark as created
        setIsEscrowCreated(true);
        
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
  }, [isEnded, isProcessing, isEscrowCreated, conversationId, currentPrice, productTitle, toast]);
  
  return {
    isAuctionEnded: isEnded,
    isEscrowProposalCreated: isEscrowCreated,
    isProcessingEscrow: isProcessing
  };
}
