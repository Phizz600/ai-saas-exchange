
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function EscrowFeedbackPrompt({ open, onClose, transactionId, currentUserId, conversationId, userRole }: {
  open: boolean;
  onClose: () => void;
  transactionId: string;
  currentUserId: string;
  conversationId: string;
  userRole: "buyer" | "seller";
}) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async () => {
    setIsSubmitting(true);
    try {
      await supabase.from("transaction_feedback").insert({
        transaction_id: transactionId,
        user_id: currentUserId,
        user_role: userRole,
        conversation_id: conversationId,
        feedback,
        rating: 5, // Or use UI for rating
      });
      toast({
        title: "Thank you for your feedback!",
        description: "Your review has been recorded.",
      });
      onClose();
    } catch (e: any) {
      toast({
        title: "Error submitting feedback",
        description: e?.message ?? "Could not submit review",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>
        <Textarea 
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="How was your transaction experience?"
        />
        <Button onClick={submitFeedback} disabled={isSubmitting || !feedback.trim()} className="mt-3">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
