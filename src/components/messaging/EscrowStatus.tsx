import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EscrowTransaction, updateEscrowStatus, generateEscrowSummaryForDownload, addPaymentReceiptMessage } from "@/integrations/supabase/escrow";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Clock, Download, MessageSquare, ShieldAlert, CreditCard, DollarSign, AlertCircle, Upload, CheckCircle, ClipboardCheck, Bell } from "lucide-react";
import { PaymentMethodDialog } from "./PaymentMethodDialog";
import { verifyPaymentIntent } from "@/services/stripe-service";

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
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  
  // New state for delivery features
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState("");
  const [deliveryFiles, setDeliveryFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationChecklist, setVerificationChecklist] = useState({
    receivedAsDescribed: false,
    qualityAsExpected: false,
    functionalityWorks: false,
    documentationComplete: false,
  });
  const [reminderSent, setReminderSent] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      case "delivery_in_progress":
        // 3 days to receive
        deadlineDate = new Date(transaction.updated_at || transaction.created_at);
        deadlineDate.setDate(deadlineDate.getDate() + 3);
        stageName = "Receipt";
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
      stageName,
      deadline: deadlineDate
    };
  };
  
  const remainingTime = getRemainingTime();

  // Auto reminder for pending actions
  useEffect(() => {
    if (!remainingTime || reminderSent) return;
    
    // If less than 24 hours remaining and reminder not sent
    const hoursTillDeadline = (remainingTime.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (hoursTillDeadline <= 24 && !reminderSent) {
      // Send reminder based on current status and role
      const sendReminder = async () => {
        try {
          // Determine message based on status and user role
          let reminderMessage = "";
          
          if (transaction.status === "agreement_reached" && userRole === "buyer") {
            reminderMessage = `⏰ **Reminder: Payment Due Soon**\n\nYour payment for this transaction is due within ${Math.floor(hoursTillDeadline)} hours. Please complete the payment to proceed with the transaction.`;
          } else if (transaction.status === "payment_secured" && userRole === "seller") {
            reminderMessage = `⏰ **Reminder: Delivery Due Soon**\n\nYou need to confirm delivery of this transaction within ${Math.floor(hoursTillDeadline)} hours. Please provide delivery details to proceed.`;
          } else if (transaction.status === "delivery_in_progress" && userRole === "buyer") {
            reminderMessage = `⏰ **Reminder: Confirmation Due Soon**\n\nPlease confirm receipt of your purchase within ${Math.floor(hoursTillDeadline)} hours.`;
          } else if (transaction.status === "inspection_period" && userRole === "buyer") {
            reminderMessage = `⏰ **Reminder: Inspection Period Ending Soon**\n\nYour inspection period will end in ${Math.floor(hoursTillDeadline)} hours. Please complete your verification to release funds to the seller.`;
          } else {
            return; // No applicable reminder
          }
          
          if (reminderMessage) {
            await supabase
              .from('messages')
              .insert({
                conversation_id: conversationId,
                content: reminderMessage,
                sender_id: 'system'
              });
            
            setReminderSent(true);
          }
        } catch (error) {
          console.error("Error sending reminder:", error);
        }
      };
      
      sendReminder();
    }
  }, [remainingTime, reminderSent, transaction.status, userRole, conversationId]);

  const getStatusActions = () => {
    const { status } = transaction;
    
    if (userRole === "buyer") {
      switch (status) {
        case "agreement_reached":
        case "escrow_created":
        case "manual_setup":
          return {
            label: "Pay Now",
            action: "showPayment",
            nextStatus: null
          };
        case "delivery_in_progress":
          return {
            label: "Verify Receipt",
            action: "showVerification",
            nextStatus: null
          };
        case "inspection_period":
          return {
            label: "Accept & Release Funds",
            action: "updateStatus",
            nextStatus: "completed"
          };
        default:
          return null;
      }
    } else if (userRole === "seller") {
      switch (status) {
        case "payment_secured":
          return {
            label: "Confirm Delivery",
            action: "showDelivery",
            nextStatus: null
          };
        default:
          return null;
      }
    }
    
    return null;
  };
  
  const action = getStatusActions();
  
  const handleStatusUpdate = async () => {
    if (!action || !action.nextStatus) return;
    
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

  const handleActionClick = () => {
    if (!action) return;
    
    if (action.action === "showPayment") {
      setShowPaymentDialog(true);
    } else if (action.action === "updateStatus") {
      handleStatusUpdate();
    } else if (action.action === "showDelivery") {
      setShowDeliveryDialog(true);
    } else if (action.action === "showVerification") {
      setShowVerificationDialog(true);
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

  const handlePaymentComplete = async (paymentIntentId: string) => {
    if (!paymentIntentId) {
      setPaymentError("Missing payment information");
      return;
    }
    
    // Verify the payment intent status
    try {
      setVerifyingPayment(true);
      const { status, success, error } = await verifyPaymentIntent(paymentIntentId);
      
      if (success && (status === 'requires_capture' || status === 'succeeded')) {
        // Update transaction status
        await updateEscrowStatus(transaction.id, "payment_secured");
        
        // Add payment receipt message to the conversation
        await addPaymentReceiptMessage(
          conversationId, 
          transaction.id, 
          paymentIntentId, 
          transaction.amount + transaction.platform_fee + transaction.escrow_fee
        );
        
        toast({
          title: "Payment successful",
          description: "Your payment has been processed and the funds are now in escrow."
        });
        
        setShowPaymentDialog(false);
        onStatusChange();
      } else {
        setPaymentError(`Payment verification failed: ${error || `Status: ${status}`}`);
      }
    } catch (err: any) {
      console.error("Error verifying payment:", err);
      setPaymentError(`Error verifying payment: ${err.message}`);
    } finally {
      setVerifyingPayment(false);
    }
  };
  
  // Handle delivery confirmation (seller)
  const handleConfirmDelivery = async () => {
    if (!deliveryDetails.trim()) {
      toast({
        title: "Delivery details required",
        description: "Please provide information about how the product was delivered",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      let fileUrls: string[] = [];
      
      // Upload files if any
      if (deliveryFiles.length > 0) {
        setIsUploading(true);
        
        for (let i = 0; i < deliveryFiles.length; i++) {
          const file = deliveryFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${transaction.id}-delivery-${Date.now()}.${fileExt}`;
          
          // Use separate progress tracking
          const { data, error } = await supabase.storage
            .from('escrow-deliveries')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (error) {
            console.error('Error uploading file:', error);
            throw error;
          }
          
          // Update progress manually after each file
          setUploadProgress((i + 1) / deliveryFiles.length * 100);
          
          const { data: urlData } = supabase.storage
            .from('escrow-deliveries')
            .getPublicUrl(fileName);
            
          fileUrls.push(urlData.publicUrl);
        }
        
        setIsUploading(false);
      }
      
      // Update transaction status
      await updateEscrowStatus(transaction.id, "delivery_in_progress");
      
      // Add delivery confirmation message with file links
      let messageContent = `📦 **DELIVERY CONFIRMATION**\n\n${deliveryDetails}\n\n`;
      
      if (fileUrls.length > 0) {
        messageContent += "**Delivery proof:**\n\n";
        fileUrls.forEach((url, index) => {
          messageContent += `[Attachment ${index + 1}](${url})\n`;
        });
      }
      
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: messageContent,
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      toast({
        title: "Delivery confirmed",
        description: "Your delivery confirmation has been sent to the buyer."
      });
      
      setShowDeliveryDialog(false);
      setDeliveryDetails("");
      setDeliveryFiles([]);
      setUploadProgress(0);
      
      onStatusChange();
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      toast({
        title: "Error confirming delivery",
        description: error.message || "An error occurred while confirming delivery.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };
  
  // Handle file selection for delivery proof
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setDeliveryFiles(prev => [...prev, ...newFiles]);
  };
  
  // Handle removing a file from the list
  const handleRemoveFile = (indexToRemove: number) => {
    setDeliveryFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  // Handle verification checklist (buyer)
  const handleSubmitVerification = async () => {
    // Check if at least one item in checklist is checked
    const isAnyItemChecked = Object.values(verificationChecklist).some(value => value);
    
    if (!isAnyItemChecked) {
      toast({
        title: "Verification required",
        description: "Please verify at least one item on the checklist",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Generate verification message
      let verificationMessage = "✅ **RECEIPT VERIFICATION**\n\nThe following items have been verified:\n\n";
      
      if (verificationChecklist.receivedAsDescribed) {
        verificationMessage += "- ✓ Received as described\n";
      }
      if (verificationChecklist.qualityAsExpected) {
        verificationMessage += "- ✓ Quality meets expectations\n";
      }
      if (verificationChecklist.functionalityWorks) {
        verificationMessage += "- ✓ Functionality works properly\n";
      }
      if (verificationChecklist.documentationComplete) {
        verificationMessage += "- ✓ Documentation is complete\n";
      }
      
      // Update transaction status
      await updateEscrowStatus(transaction.id, "inspection_period");
      
      // Add verification message
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: verificationMessage,
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      toast({
        title: "Receipt verified",
        description: "You have confirmed receipt of the product and can now inspect it before releasing funds."
      });
      
      setShowVerificationDialog(false);
      
      onStatusChange();
    } catch (error: any) {
      console.error("Error verifying receipt:", error);
      toast({
        title: "Error verifying receipt",
        description: error.message || "An error occurred while verifying receipt.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
              onClick={handleActionClick}
              disabled={loading}
            >
              {action.action === "showPayment" && <CreditCard className="h-4 w-4 mr-1" />}
              {action.action === "showDelivery" && <Upload className="h-4 w-4 mr-1" />}
              {action.action === "showVerification" && <ClipboardCheck className="h-4 w-4 mr-1" />}
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
      
      {/* Payment Method Dialog */}
      <PaymentMethodDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        transaction={transaction}
        onPaymentComplete={handlePaymentComplete}
        error={paymentError}
        isVerifying={verifyingPayment}
      />
      
      {/* Delivery Dialog */}
      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle className="flex items-center">
            <Upload className="h-5 w-5 text-[#8B5CF6] mr-2" />
            Confirm Delivery
          </DialogTitle>
          <DialogDescription>
            Provide details about the delivery and upload any proof or documentation.
            This will notify the buyer that the product has been delivered.
          </DialogDescription>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delivery-details">Delivery Information</Label>
              <Textarea 
                id="delivery-details"
                placeholder="Explain how the product was delivered, access details, or any instructions for the buyer..."
                value={deliveryDetails}
                onChange={(e) => setDeliveryDetails(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Delivery Proof (optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Screenshots, documents, or videos (max 10MB)
                    </p>
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            
            {/* Show selected files */}
            {deliveryFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files:</Label>
                <div className="space-y-2">
                  {deliveryFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="truncate max-w-[300px]">{file.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeliveryDialog(false)}
              disabled={loading || isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelivery}
              disabled={loading || isUploading || !deliveryDetails.trim()}
            >
              {loading || isUploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : (
                <CheckCircle className="h-4 w-4 mr-1" />
              )}
              Confirm Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <DialogTitle className="flex items-center">
            <ClipboardCheck className="h-5 w-5 text-[#8B5CF6] mr-2" />
            Verify Receipt
          </DialogTitle>
          <DialogDescription>
            Please verify that you have received the product by checking the items below
