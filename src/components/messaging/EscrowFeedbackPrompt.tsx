
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

export function EscrowFeedbackPrompt({ open, onClose, transactionId, currentUserId, conversationId, userRole }: {
  open: boolean;
  onClose: () => void;
  transactionId: string;
  currentUserId: string;
  conversationId: string;
  userRole: "buyer" | "seller";
}) {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
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
        rating,
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
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Rate your experience:</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 rounded-full transition-all ${
                  rating >= star ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        </div>
        <Textarea 
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="How was your transaction experience?"
          className="min-h-[100px]"
        />
        <Button onClick={submitFeedback} disabled={isSubmitting} className="mt-3 w-full">
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
