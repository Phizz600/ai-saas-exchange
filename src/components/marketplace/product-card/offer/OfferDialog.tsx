import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OfferDialogProps {
  productId: string;
  productTitle: string;
  onClose: () => void;
}

export function OfferDialog({ productId, productTitle, onClose }: OfferDialogProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to make an offer",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('offers')
        .insert({
          product_id: productId,
          bidder_id: user.id,
          amount: Number(amount),
          message,
        });

      if (error) throw error;

      toast({
        title: "Offer submitted",
        description: "Your offer has been sent to the seller",
      });
      onClose();

    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Make an Offer</h3>
        <p className="text-sm text-gray-500 mb-4">
          Submit your offer for {productTitle}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Offer Amount ($)
        </label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter your offer amount"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message (optional)
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message to the seller"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Offer"}
        </Button>
      </div>
    </form>
  );
}