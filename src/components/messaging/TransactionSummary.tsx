
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, DollarSign, MessageSquare, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EscrowTransaction } from "@/integrations/supabase/escrow";
import { Timeline, TimelineItem } from "./Timeline";

interface TransactionSummaryProps {
  transaction: EscrowTransaction;
  userRole: "buyer" | "seller";
  conversationId: string;
}

export function TransactionSummary({ transaction, userRole, conversationId }: TransactionSummaryProps) {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const { toast } = useToast();

  // Generate transaction timeline
  const generateTimeline = () => {
    const timeline: TimelineItem[] = [
      {
        title: "Transaction Started",
        description: "Agreement reached between buyer and seller",
        timestamp: new Date(transaction.created_at).toLocaleString(),
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      }
    ];

    // Add payment secured event if applicable
    if (transaction.status !== "agreement_reached" && transaction.status !== "manual_setup") {
      timeline.push({
        title: "Payment Secured",
        description: `$${transaction.amount.toFixed(2)} held in escrow`,
        timestamp: transaction.updated_at 
          ? new Date(transaction.updated_at).toLocaleString() 
          : "Not completed",
        icon: <DollarSign className="h-4 w-4 text-blue-500" />
      });
    }

    // Add delivery event if applicable
    if (["delivery_in_progress", "inspection_period", "completed", "disputed"].includes(transaction.status)) {
      timeline.push({
        title: "Delivery Confirmed",
        description: "Seller confirmed delivery of the product",
        timestamp: transaction.updated_at 
          ? new Date(transaction.updated_at).toLocaleString() 
          : "Not completed",
        icon: <Clock className="h-4 w-4 text-purple-500" />
      });
    }

    // Add verification event if applicable
    if (["inspection_period", "completed", "disputed"].includes(transaction.status)) {
      timeline.push({
        title: "Receipt Verified",
        description: "Buyer confirmed receipt of the product",
        timestamp: transaction.updated_at 
          ? new Date(transaction.updated_at).toLocaleString() 
          : "Not completed",
        icon: <CheckCircle className="h-4 w-4 text-indigo-500" />
      });
    }

    // Add completion event if applicable
    if (transaction.status === "completed") {
      timeline.push({
        title: "Transaction Completed",
        description: "Funds released to seller",
        timestamp: transaction.updated_at 
          ? new Date(transaction.updated_at).toLocaleString() 
          : "Not completed",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      });
    }

    // Add disputed event if applicable
    if (transaction.status === "disputed") {
      timeline.push({
        title: "Transaction Disputed",
        description: "Dispute initiated by one of the parties",
        timestamp: transaction.updated_at 
          ? new Date(transaction.updated_at).toLocaleString() 
          : "Unknown",
        icon: <MessageSquare className="h-4 w-4 text-red-500" />
      });
    }

    return timeline;
  };

  // Handle submitting feedback
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting feedback",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Store the feedback in the database
      const { error } = await supabase
        .from('transaction_feedback')
        .insert({
          transaction_id: transaction.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          user_role: userRole,
          rating,
          feedback,
          conversation_id: conversationId
        });

      if (error) throw error;

      // Add feedback message to conversation
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: `⭐ **TRANSACTION FEEDBACK**\n\n${userRole === 'buyer' ? 'Buyer' : 'Seller'} rated this transaction: ${rating}/5 stars\n\n${feedback ? `"${feedback}"` : ''}`,
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!"
      });

      setFeedbackSubmitted(true);
      setShowFeedbackDialog(false);
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error submitting feedback",
        description: error.message || "An error occurred while submitting feedback",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Star rating component
  const StarRating = () => {
    return (
      <div className="flex items-center space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`p-1 rounded-full focus:outline-none focus:ring-1 ${
              rating >= star ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <Star className="h-6 w-6" fill={rating >= star ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  // Only show for completed transactions
  if (transaction.status !== "completed") {
    return null;
  }

  return (
    <>
      <Card className="mb-4 border-t-4 border-t-emerald-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
            Transaction Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <Timeline items={generateTimeline()} />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {!feedbackSubmitted && (
            <Button 
              onClick={() => setShowFeedbackDialog(true)}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90"
            >
              <Star className="h-4 w-4 mr-2" />
              Rate This Transaction
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogTitle className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 mr-2" />
            Rate This Transaction
          </DialogTitle>
          <DialogDescription>
            Please rate your experience with this transaction and provide any feedback.
          </DialogDescription>
          
          <div className="py-4 space-y-4">
            <div className="flex justify-center">
              <StarRating />
            </div>
            
            <div>
              <Textarea 
                placeholder="Share your feedback about this transaction (optional)..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowFeedbackDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitFeedback}
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? 
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : 
                null
              }
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
