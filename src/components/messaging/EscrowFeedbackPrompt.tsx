
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
      <DialogContent className="max-w-md">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-3 exo-2-heading bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] bg-clip-text text-transparent">
            How was your experience?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your feedback helps improve our escrow service and builds trust in our community.
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1.5 rounded-full transition-all transform ${
                  rating >= star 
                    ? 'text-amber-400 hover:text-amber-500 scale-110' 
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <Star className={`h-8 w-8 fill-current ${rating >= star ? 'drop-shadow-md' : ''}`} />
              </button>
            ))}
          </div>
          <p className="text-center text-sm font-medium">
            {rating === 1 && "Needs improvement"}
            {rating === 2 && "Below expectations"}
            {rating === 3 && "Acceptable"}
            {rating === 4 && "Good experience"}
            {rating === 5 && "Excellent!"}
          </p>
        </div>
        
        <Textarea 
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Share details about your transaction experience..."
          className="min-h-[120px] resize-none"
        />
        
        <Button 
          onClick={submitFeedback} 
          disabled={isSubmitting} 
          className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white hover:opacity-90"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
