
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { EscrowTransaction, updateEscrowStatus, generateEscrowSummaryForDownload } from "@/integrations/supabase/escrow";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Clock, Download, MessageSquare, ShieldAlert } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-gray-200 text-gray-800",
  agreement_reached: "bg-blue-100 text-blue-800",
  escrow_created: "bg-purple-100 text-purple-800",
  payment_secured: "bg-green-100 text-green-800",
  delivery_in_progress: "bg-yellow-100 text-yellow-800",
  inspection_period: "bg-cyan-100 text-cyan-800",
  completed: "bg-emerald-100 text-emerald-800",
  disputed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
  manual_setup: "bg-orange-100 text-orange-800"
};

interface EscrowStatusProps {
  transaction: EscrowTransaction;
  userRole: "buyer" | "seller";
  conversationId: string;
  onStatusChange: () => void;
}

export const EscrowStatus = ({ 
  transaction,
  userRole,
  conversationId,
  onStatusChange
}: EscrowStatusProps) => {
  const [loading, setLoading] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [showEvidenceDialog, setShowEvidenceDialog] = useState(false);
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const { toast } = useToast();
  
  // Calculate remaining time for the current stage
  const getRemainingTime = () => {
    if (!transaction.created_at) return null;
    
    let deadlineDate: Date | null = null;
    let stageName = "";
    
    switch (transaction.status) {
      case "agreement_reached":
      case "escrow_created":
      case "manual_setup":
        // 3 days to make payment
        deadlineDate = new Date(transaction.created_at);
        deadlineDate.setDate(deadlineDate.getDate() + 3);
        stageName = "Payment";
        break;
      case "payment_secured":
        // 7 days to deliver
        deadlineDate = new Date(transaction.updated_at || transaction.created_at);
        deadlineDate.setDate(deadlineDate.getDate() + 7);
        stageName = "Delivery";
        break;
      case "inspection_period":
        // 2 days for inspection
        deadlineDate = new Date(transaction.updated_at || transaction.created_at);
        deadlineDate.setDate(deadlineDate.getDate() + 2);
        stageName = "Inspection";
        break;
      default:
        return null;
    }
    
    const now = new Date();
    if (deadlineDate < now) return null;
    
    const diffTime = Math.abs(deadlineDate.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return {
      days: diffDays,
      hours: diffHours,
      stageName
    };
  };
  
  const remainingTime = getRemainingTime();

  const getStatusActions = () => {
    const { status } = transaction;
    
    if (userRole === "buyer") {
      switch (status) {
        case "agreement_reached":
        case "escrow_created":
        case "manual_setup":
          return {
            label: "Pay to Escrow",
            nextStatus: "payment_secured"
          };
        case "delivery_in_progress":
          return {
            label: "Mark as Received",
            nextStatus: "inspection_period"
          };
        case "inspection_period":
          return {
            label: "Accept & Release Funds",
            nextStatus: "completed"
          };
        default:
          return null;
      }
    } else if (userRole === "seller") {
      switch (status) {
        case "payment_secured":
          return {
            label: "Start Delivery",
            nextStatus: "delivery_in_progress"
          };
        default:
          return null;
      }
    }
    
    return null;
  };
  
  const action = getStatusActions();
  
  const handleStatusUpdate = async () => {
    if (!action) return;
    
    try {
      setLoading(true);
      await updateEscrowStatus(transaction.id, action.nextStatus);
      toast({
        title: "Status updated",
        description: `Transaction status has been updated to ${action.nextStatus.replace(/_/g, ' ')}.`
      });
      
      // Add a message to the conversation about the status change
      try {
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: 'system',
            content: `🔄 **Escrow Status Updated**\n\nStatus changed from "${getStatusText(transaction.status)}" to "${getStatusText(action.nextStatus)}"\n\nThe transaction is progressing to the next stage.`
          });
      } catch (msgError) {
        console.error("Error adding status message to conversation:", msgError);
      }
      
      onStatusChange();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error updating status",
        description: error.message || "An error occurred while updating the status.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleInitiateDispute = async () => {
    if (!disputeReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for the dispute",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Update transaction status
      await updateEscrowStatus(transaction.id, "disputed");
      
      // Add dispute reason as a message
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: `🚨 **DISPUTE INITIATED**\n\nReason: ${disputeReason}\n\nThe transaction has been marked as disputed. Both parties will be contacted shortly.`,
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      toast({
        title: "Dispute initiated",
        description: "The transaction has been marked as disputed. Support will contact both parties."
      });
      
      setShowDisputeDialog(false);
      onStatusChange();
    } catch (error: any) {
      console.error("Error initiating dispute:", error);
      toast({
        title: "Error initiating dispute",
        description: error.message || "An error occurred while initiating the dispute.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvidence = async () => {
    if (!evidenceDescription.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a description of your evidence",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Add evidence as a message
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: `📝 **EVIDENCE SUBMITTED**\n\n${evidenceDescription}`,
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      toast({
        title: "Evidence submitted",
        description: "Your evidence has been added to the conversation history."
      });
      
      setShowEvidenceDialog(false);
    } catch (error: any) {
      console.error("Error submitting evidence:", error);
      toast({
        title: "Error submitting evidence",
        description: error.message || "An error occurred while submitting evidence.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSummary = () => {
    // Create a blob and download
    const htmlContent = generateEscrowSummaryForDownload(transaction);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `escrow-transaction-${transaction.id.substring(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Transaction summary downloaded",
      description: "The transaction summary has been downloaded to your device."
    });
  };

  return (
    <>
      <Card className="mb-4 border-t-4" style={{ borderTopColor: transaction.status === 'disputed' ? '#ef4444' : '#8B5CF6' }}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Escrow Transaction</CardTitle>
            <Badge className={statusColors[transaction.status]}>
              {getStatusText(transaction.status)}
            </Badge>
          </div>
          <CardDescription>
            Transaction ID: {transaction.id.substring(0, 8)}...
            {transaction.timeline && (
              <span className="ml-2">Timeline: {transaction.timeline}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">${transaction.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform Fee:</span>
              <span className="font-medium">${transaction.platform_fee.toFixed(2)}</span>
            </div>
            {transaction.escrow_fee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Escrow Fee:</span>
                <span className="font-medium">${transaction.escrow_fee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Seller Receives:</span>
              <span className="font-medium">
                ${(transaction.amount - transaction.platform_fee - transaction.escrow_fee).toFixed(2)}
              </span>
            </div>
            
            {transaction.description && (
              <div className="pt-2 border-t mt-2">
                <span className="text-sm text-muted-foreground">Description: </span>
                <span className="text-sm">{transaction.description}</span>
              </div>
            )}
            
            {remainingTime && (
              <div className="pt-2 mt-2 border-t">
                <div className="flex items-center text-sm text-amber-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {remainingTime.stageName} deadline: {remainingTime.days}d {remainingTime.hours}h remaining
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {action && (
            <Button 
              className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
              onClick={handleStatusUpdate}
              disabled={loading}
            >
              {loading ? 
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : 
                action.label
              }
            </Button>
          )}
          
          <div className="flex w-full gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowDisputeDialog(true)}
              disabled={transaction.status === "disputed" || transaction.status === "completed"}
            >
              <ShieldAlert className="h-4 w-4 mr-1" />
              Dispute
            </Button>
            
            {transaction.status === "disputed" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setShowEvidenceDialog(true)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Evidence
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleDownloadSummary}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Dispute Dialog */}
      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Initiate Dispute
          </DialogTitle>
          <DialogDescription>
            This will notify support of a dispute with this transaction. 
            Please provide a clear reason for the dispute.
          </DialogDescription>
          
          <div className="py-4">
            <Textarea 
              placeholder="Describe the issue in detail..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDisputeDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleInitiateDispute}
              disabled={loading || !disputeReason.trim()}
            >
              {loading ? 
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : 
                "Submit Dispute"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Evidence Dialog */}
      <Dialog open={showEvidenceDialog} onOpenChange={setShowEvidenceDialog}>
        <DialogContent>
          <DialogTitle>Submit Evidence</DialogTitle>
          <DialogDescription>
            Provide supporting details or evidence for the dispute.
            This will be added to the conversation history.
          </DialogDescription>
          
          <div className="py-4">
            <Textarea 
              placeholder="Describe your evidence or justification..."
              value={evidenceDescription}
              onChange={(e) => setEvidenceDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEvidenceDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitEvidence}
              disabled={loading || !evidenceDescription.trim()}
            >
              {loading ? 
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : 
                "Submit Evidence"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
