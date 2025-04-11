
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EscrowTransaction } from "@/integrations/supabase/escrow";
import { supabase } from "@/integrations/supabase/client";

interface TransactionSummaryProps {
  transaction: EscrowTransaction;
  userRole: "buyer" | "seller";
  conversationId: string;
}

export const TransactionSummary = ({
  transaction,
  userRole,
  conversationId
}: TransactionSummaryProps) => {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [checkingFeedback, setCheckingFeedback] = useState(true);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionTimeline, setTransactionTimeline] = useState<Array<{ status: string; timestamp: string }>>([]);
  
  const { toast } = useToast();

  // Check if the user has already submitted feedback
  useEffect(() => {
    const checkExistingFeedback = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setCheckingFeedback(false);
          return;
        }
        
        const { data, error } = await supabase
          .from("transaction_feedback")
          .select("*")
          .eq("transaction_id", transaction.id)
          .eq("user_id", user.id)
          .single();
          
        if (data) {
          setFeedbackSubmitted(true);
        }
        
        setCheckingFeedback(false);
      } catch (error) {
        console.error("Error checking feedback status:", error);
        setCheckingFeedback(false);
      }
    };
    
    // Get transaction timeline
    const getTransactionTimeline = async () => {
      try {
        const { data: messages, error } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conversationId)
          .eq("sender_id", "system")
          .ilike("content", "%Escrow Status Update%")
          .order("created_at", { ascending: true });
          
        if (error) {
          console.error("Error fetching status messages:", error);
          return;
        }
        
        // Extract status information from messages
        const timeline = messages.map(msg => {
          // Try to extract status from message
          const statusMatch = msg.content.match(/Status: ([A-Z\s]+)/);
          const status = statusMatch ? statusMatch[1].trim() : "Status Update";
          
          return {
            status,
            timestamp: new Date(msg.created_at).toLocaleString()
          };
        });
        
        // Add initial status if we don't have one
        if (timeline.length === 0) {
          timeline.push({
            status: "TRANSACTION CREATED",
            timestamp: new Date(transaction.created_at).toLocaleString()
          });
        }
        
        // Always add completed status if transaction is completed
        if (transaction.status === "completed" && 
            !timeline.some(item => item.status.includes("COMPLETED"))) {
          timeline.push({
            status: "TRANSACTION COMPLETED",
            timestamp: new Date(transaction.updated_at).toLocaleString()
          });
        }
        
        setTransactionTimeline(timeline);
      } catch (error) {
        console.error("Error fetching transaction timeline:", error);
      }
    };
    
    checkExistingFeedback();
    getTransactionTimeline();
    
    // Show feedback dialog automatically after a short delay
    // but only if transaction completed recently (within last 24 hours)
    const shouldShowDialog = () => {
      if (transaction.status !== "completed") return false;
      
      const completedTime = new Date(transaction.updated_at);
      const now = new Date();
      const timeDiff = now.getTime() - completedTime.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      return hoursDiff < 24; // Only show automatically if completed in last 24 hours
    };
    
    if (shouldShowDialog()) {
      const timer = setTimeout(() => {
        if (!feedbackSubmitted && !checkingFeedback) {
          setShowFeedbackDialog(true);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [transaction.id, transaction.status, transaction.updated_at, conversationId]);

  const handleSubmitFeedback = async () => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to provide feedback",
          variant: "destructive"
        });
        return;
      }
      
      // Create the feedback record
      const { error } = await supabase
        .from("transaction_feedback")
        .insert({
          transaction_id: transaction.id,
          conversation_id: conversationId,
          user_id: user.id,
          user_role: userRole,
          rating,
          feedback
        });
        
      if (error) {
        console.error("Error submitting feedback:", error);
        toast({
          title: "Error submitting feedback",
          description: "An error occurred while submitting your feedback. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Send a message to the conversation about the feedback
      await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: `⭐ **Transaction Rating: ${rating}/5**\n\n${feedback ? `"${feedback}"` : "No additional comments provided."}`
        });
      
      setFeedbackSubmitted(true);
      setShowFeedbackDialog(false);
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!"
      });
    } catch (error) {
      console.error("Error in handleSubmitFeedback:", error);
      toast({
        title: "Error submitting feedback",
        description: "An error occurred while submitting your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format transaction amount with commas
  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <>
      <Card className="mb-4 border-t-4 border-t-emerald-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            Transaction Summary
            <span className="ml-auto text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
              Completed
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="border-b pb-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Transaction Amount</p>
                <p className="font-medium">${formatAmount(transaction.amount)}</p>
              </div>
              <div>
                <p className="text-gray-500">Platform Fee</p>
                <p className="font-medium">${formatAmount(transaction.platform_fee)}</p>
              </div>
              <div>
                <p className="text-gray-500">Escrow Fee</p>
                <p className="font-medium">${formatAmount(transaction.escrow_fee)}</p>
              </div>
              <div>
                <p className="text-gray-500">Total</p>
                <p className="font-medium">${formatAmount(transaction.amount + transaction.platform_fee + transaction.escrow_fee)}</p>
              </div>
            </div>
          </div>
          
          {/* Transaction Timeline */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">Transaction Timeline</h3>
            <div className="space-y-3">
              {transactionTimeline.map((event, index) => (
                <div key={index} className="flex text-sm">
                  <div className="relative mr-3">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    {index < transactionTimeline.length - 1 && (
                      <div className="absolute top-6 bottom-0 left-3 -ml-px w-0.5 bg-gray-200 h-full"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">{event.status}</p>
                    <p className="text-gray-500 text-xs">{event.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          {!feedbackSubmitted && !checkingFeedback && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setShowFeedbackDialog(true)}
            >
              <Star className="h-4 w-4 mr-2 text-amber-500" />
              Rate This Transaction
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              Please rate your experience with this transaction. Your feedback helps improve our platform.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex justify-center">
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
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback">Additional Comments (Optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts about this transaction..."
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></span>
                  Submitting...
                </span>
              ) : 'Submit Feedback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
