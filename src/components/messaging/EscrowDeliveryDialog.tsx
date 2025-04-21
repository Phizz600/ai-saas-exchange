
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { updateEscrowStatus } from "@/integrations/supabase/escrow";
import { supabase } from "@/integrations/supabase/client";

interface EscrowDeliveryDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: any;
  onStatusChange: () => void;
}

export const EscrowDeliveryDialog: React.FC<EscrowDeliveryDialogProps> = ({
  open,
  onClose,
  transaction,
  onStatusChange
}) => {
  const [deliveryDetails, setDeliveryDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!deliveryDetails.trim()) {
      toast({
        title: "Details required",
        description: "Please provide delivery details",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update escrow status
      await updateEscrowStatus(transaction.id, "delivery_in_progress");
      
      // Add a message to the conversation
      await supabase.from("messages").insert({
        conversation_id: transaction.conversation_id,
        sender_id: "system",
        content: `🚚 **Delivery Confirmed**\n\nThe seller has confirmed delivery of the product with the following details:\n\n${deliveryDetails}`
      });
      
      toast({
        title: "Delivery confirmed",
        description: "You've confirmed delivery. The buyer will be notified."
      });
      
      onStatusChange();
      onClose();
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      toast({
        title: "Error confirming delivery",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDeliveryDetails("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delivery</DialogTitle>
          <DialogDescription>
            Provide details about the delivery to the buyer
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="delivery-details">Delivery Details</Label>
            <Textarea
              id="delivery-details"
              placeholder="Provide delivery information, tracking numbers, access details, or instructions..."
              value={deliveryDetails}
              onChange={(e) => setDeliveryDetails(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Confirming...
              </span>
            ) : (
              "Confirm Delivery"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
