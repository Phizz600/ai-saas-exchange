
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
import { 
  EscrowTransaction, 
  updateEscrowStatus, 
  generateEscrowSummaryForDownload, 
  addPaymentReceiptMessage,
  notifyFundsReleased
} from "@/integrations/supabase/escrow";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Clock, 
  Download, 
  MessageSquare, 
  ShieldAlert, 
  CreditCard, 
  AlertCircle, 
  Upload, 
  CheckCircle, 
  ClipboardCheck 
} from "lucide-react";
import { PaymentMethodDialog } from "./PaymentMethodDialog";
import { verifyPaymentIntent } from "@/services/stripe-service";
import { TransactionSummary } from "./TransactionSummary";

const statusColors: Record<string, string> = {
  agreement_reached: "bg-blue-100 text-blue-800",
  payment_secured: "bg-green-100 text-green-800",
  delivery_in_progress: "bg-purple-100 text-purple-800",
  inspection_period: "bg-indigo-100 text-indigo-800",
  completed: "bg-emerald-100 text-emerald-800",
  disputed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
  manual_setup: "bg-yellow-100 text-yellow-800",
  deposit_pending: "bg-orange-100 text-orange-800",
  deposit_paid: "bg-teal-100 text-teal-800"
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
  const [disputeEvidence, setDisputeEvidence] = useState("");
  const [showEvidenceDialog, setShowEvidenceDialog] = useState(false);
  const [evidenceText, setEvidenceText] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState("");
  const [deliveryFiles, setDeliveryFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationChecklist, setVerificationChecklist] = useState({
    receivedAsDescribed: false,
    qualityAsExpected: false,
    functionalityWorks: false,
    documentationComplete: false
  });
  const [autoReminderSent, setAutoReminderSent] = useState(false);
  const { toast } = useToast();

  // Calculate remaining time for inspection period
  const getRemainingTime = (status: string) => {
    if (status === "agreement_reached") {
      return 24; // 24 hours for payment
    } else if (status === "payment_secured") {
      return 48; // 48 hours for delivery
    } else if (status === "delivery_in_progress") {
      return 24; // 24 hours for confirmation
    } else if (status === "inspection_period") {
      return 72; // 72 hours for inspection
    }
    return 0;
  };

  const remainingTime = getRemainingTime(transaction.status);

  // Send automated reminder
  useEffect(() => {
    if (autoReminderSent) return;
    
    const sendReminder = async () => {
      const hoursRemaining = remainingTime;
      
      if (hoursRemaining > 0) {
        // Send reminder 6 hours before deadline
        if (hoursRemaining <= 6) {
          try {
            const { error } = await supabase.functions.invoke('send-escrow-reminder', {
              body: {
                conversationId: conversationId,
                transactionId: transaction.id,
                userRole: userRole,
                status: transaction.status,
                hoursRemaining: hoursRemaining
              }
            });
            
            if (error) {
              console.error('Error sending escrow reminder:', error);
            } else {
              setAutoReminderSent(true);
            }
          } catch (error) {
            console.error('Error invoking send-escrow-reminder function:', error);
          }
        }
      }
    };
    
    sendReminder();
  }, [transaction.status, userRole, conversationId, remainingTime, autoReminderSent]);

  // Define available actions based on status and user role
  const getStatusActions = () => {
    if (transaction.status === "agreement_reached" && userRole === "buyer") {
      return {
        action: "showPayment",
        label: "Make Payment",
        nextStatus: "payment_secured"
      };
    } else if (transaction.status === "payment_secured" && userRole === "seller") {
      return {
        action: "showDelivery",
        label: "Confirm Delivery",
        nextStatus: "delivery_in_progress"
      };
    } else if (transaction.status === "delivery_in_progress" && userRole === "buyer") {
      return {
        action: "showVerification",
        label: "Verify Receipt",
        nextStatus: "inspection_period"
      };
    } else if (transaction.status === "inspection_period" && userRole === "buyer") {
      return {
        action: "updateStatus",
        label: "Accept & Release Funds",
        nextStatus: "completed"
      };
    }
    return null;
  };

  const action = getStatusActions();
  
  const handleStatusUpdate = async () => {
    if (!action || !action.nextStatus) return;
    
    try {
      setLoading(true);
      await updateEscrowStatus(transaction.id, action.nextStatus);
      
      // If completing the transaction, send the funds release notification
      if (action.nextStatus === "completed") {
        await notifyFundsReleased(transaction.id, conversationId);
        
        toast({
          title: "Funds released",
          description: "The funds have been released to the seller. Transaction completed!"
        });
      } else {
        toast({
          title: "Status updated",
          description: `Transaction status has been updated to ${action.nextStatus.replace(/_/g, ' ')}.`
        });
      }
      
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
      
      // If transaction is completed, show automated feedback request after a short delay
      if (action.nextStatus === "completed") {
        setTimeout(() => {
          // This will be handled by the TransactionSummary component
          onStatusChange();
        }, 1500);
      } else {
        onStatusChange();
      }
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
    if (action?.action === "showPayment") {
      setShowPaymentDialog(true);
    } else if (action?.action === "showDelivery") {
      setShowDeliveryDialog(true);
    } else if (action?.action === "showVerification") {
      setShowVerificationDialog(true);
    } else {
      handleStatusUpdate();
    }
  };

  const getStatusText = (status: string) => {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleInitiateDispute = async () => {
    if (!disputeReason || !disputeEvidence) {
      toast({
        title: "Missing information",
        description: "Please provide a reason and evidence for the dispute.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Call the escrow-api function to initiate the dispute
      const { data, error } = await supabase.functions.invoke("escrow-api", {
        body: {
          action: "dispute",
          transactionId: transaction.escrow_api_id,
          data: {
            reason: disputeReason,
            description: disputeEvidence,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          },
        },
      });

      if (error) {
        console.error("Error initiating dispute:", error);
        toast({
          title: "Error initiating dispute",
          description: error.message || "An error occurred while initiating the dispute.",
          variant: "destructive",
        });
      } else {
        // Update the escrow status to "disputed"
        await updateEscrowStatus(transaction.id, "disputed");
        toast({
          title: "Dispute initiated",
          description: "The dispute has been initiated. We will review the evidence and contact both parties.",
        });
        setShowDisputeDialog(false);
        onStatusChange();
      }
    } catch (error: any) {
      console.error("Error initiating dispute:", error);
      toast({
        title: "Error initiating dispute",
        description: error.message || "An error occurred while initiating the dispute.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvidence = async () => {
    if (!evidenceText) {
      toast({
        title: "Missing information",
        description: "Please provide evidence for your claim.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Add the evidence as a message to the conversation
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
        content: `📢 **EVIDENCE SUBMITTED**\n\n${evidenceText}`,
      });

      toast({
        title: "Evidence submitted",
        description: "Your evidence has been submitted and added to the conversation.",
      });
      setShowEvidenceDialog(false);
    } catch (error: any) {
      console.error("Error submitting evidence:", error);
      toast({
        title: "Error submitting evidence",
        description: error.message || "An error occurred while submitting the evidence.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSummary = () => {
    const summary = generateEscrowSummaryForDownload(transaction);
    const blob = new Blob([summary], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `escrow-summary-${transaction.id.substring(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handlePaymentComplete = async (paymentIntentId: string) => {
    setPaymentError(null);
    setVerifyingPayment(true);
    
    try {
      // Verify the payment intent status
      const { status, error } = await verifyPaymentIntent(paymentIntentId);
      
      if (error) {
        setPaymentError(error);
        toast({
          title: "Payment verification failed",
          description: error,
          variant: "destructive"
        });
        return;
      }
      
      if (status === 'succeeded') {
        // Add a payment receipt message to the conversation
        await addPaymentReceiptMessage(
          conversationId,
          transaction.id,
          paymentIntentId,
          transaction.amount
        );
        
        // Update the escrow status to "payment_secured"
        await updateEscrowStatus(transaction.id, "payment_secured");
        
        toast({
          title: "Payment successful",
          description: "The payment has been secured and the funds are now held in escrow."
        });
        
        setShowPaymentDialog(false);
        onStatusChange();
      } else {
        setPaymentError(`Payment verification failed. Status: ${status}`);
        toast({
          title: "Payment verification failed",
          description: `Payment verification failed. Status: ${status}`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      setPaymentError(error.message || "An error occurred while verifying the payment.");
      toast({
        title: "Error verifying payment",
        description: error.message || "An error occurred while verifying the payment.",
        variant: "destructive"
      });
    } finally {
      setVerifyingPayment(false);
    }
  };
  
  const handleConfirmDelivery = async () => {
    if (!deliveryDetails.trim()) {
      toast({
        title: "Delivery details required",
        description: "Please provide details about the delivery.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      setIsUploading(true);
      
      // Upload files to storage
      const uploadPromises = deliveryFiles.map(async (file) => {
        const { data, error } = await supabase.storage
          .from('escrow-deliveries')
          .upload(`${transaction.id}/${file.name}`, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
        
        return data;
      });
      
      // Track upload progress
      let uploadedBytes = 0;
      deliveryFiles.forEach(file => {
        uploadedBytes += file.size;
      });
      
      // Wait for all files to upload
      await Promise.all(uploadPromises);
      
      // Update transaction status
      await updateEscrowStatus(transaction.id, "delivery_in_progress");
      
      // Add delivery message
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: `🚚 **DELIVERY CONFIRMATION**\n\nThe seller has confirmed delivery of the product.\n\n${deliveryDetails}`,
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      toast({
        title: "Delivery confirmed",
        description: "You have confirmed delivery of the product. The buyer will be notified."
      });
      
      setShowDeliveryDialog(false);
      
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
      setUploadProgress(0);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setDeliveryFiles(files);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...deliveryFiles];
    newFiles.splice(index, 1);
    setDeliveryFiles(newFiles);
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
      {/* Show the transaction summary for completed transactions */}
      {transaction.status === "completed" && (
        <TransactionSummary 
          transaction={transaction}
          userRole={userRole}
          conversationId={conversationId}
        />
      )}
      
      <Card className="mb-4 border-t-4" style={{ borderTopColor: transaction.status === 'disputed' ? '#ef4444' : '#8B5CF6' }}>
        <CardHeader>
          <CardTitle className="text-lg">Escrow Transaction</CardTitle>
          <CardDescription>
            Status: <Badge className={statusColors[transaction.status]}>{getStatusText(transaction.status)}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
            </p>
            <p>
              <strong>Description:</strong> {transaction.description}
            </p>
            <p>
              <strong>Timeline:</strong> {transaction.timeline || "Not specified"}
            </p>
            {transaction.status === "disputed" && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This transaction is currently under dispute. Please provide
                  evidence to support your claim.
                </AlertDescription>
              </Alert>
            )}
            {transaction.status === "manual_setup" && (
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  This transaction requires manual setup on Escrow.com. Please
                  follow the instructions in the transaction summary.
                </AlertDescription>
              </Alert>
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
              {action.action === "updateStatus" && transaction.status === "inspection_period" && (
                <CheckCircle className="h-4 w-4 mr-1" />
              )}
              {loading ? 
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : 
                action.label
              }
            </Button>
          )}
          
          {(transaction.status === "disputed" || transaction.status === "inspection_period") && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowEvidenceDialog(true)}
              disabled={loading}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Evidence
            </Button>
          )}
          
          {transaction.status === "manual_setup" && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleDownloadSummary}
              disabled={loading}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Summary
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Dispute Dialog */}
      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Initiate Dispute
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for the dispute and any supporting evidence.
          </DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="evidence">Evidence</Label>
              <Textarea
                id="evidence"
                placeholder="Provide details about the issue..."
                className="min-h-[80px]"
                value={disputeEvidence}
                onChange={(e) => setDisputeEvidence(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowDisputeDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleInitiateDispute} disabled={loading}>
              {loading ? 
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : 
                null
              }
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Evidence Dialog */}
      <Dialog open={showEvidenceDialog} onOpenChange={setShowEvidenceDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            Submit Evidence
          </DialogTitle>
          <DialogDescription>
            Please provide evidence to support your claim.
          </DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="evidence-text">Evidence</Label>
              <Textarea
                id="evidence-text"
                placeholder="Provide details about the issue..."
                className="min-h-[100px]"
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowEvidenceDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmitEvidence} disabled={loading}>
              {loading ? 
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : 
                null
              }
              Submit Evidence
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
              {loading || isUploading ? 
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : 
                null
              }
              Confirm Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <DialogTitle className="flex items-center">
            <ClipboardCheck className="h-5 w-5 text-green-500 mr-2" />
            Verify Receipt
          </DialogTitle>
          <DialogDescription>
            Please confirm that you have received the product and verify the following items as applicable.
          </DialogDescription>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="receivedAsDescribed" 
                checked={verificationChecklist.receivedAsDescribed}
                onCheckedChange={(checked) => 
                  setVerificationChecklist({
                    ...verificationChecklist,
                    receivedAsDescribed: checked === true
                  })
                }
              />
              <Label htmlFor="receivedAsDescribed">Received as described</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="qualityAsExpected" 
                checked={verificationChecklist.qualityAsExpected}
                onCheckedChange={(checked) => 
                  setVerificationChecklist({
                    ...verificationChecklist,
                    qualityAsExpected: checked === true
                  })
                }
              />
              <Label htmlFor="qualityAsExpected">Quality meets expectations</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="functionalityWorks" 
                checked={verificationChecklist.functionalityWorks}
                onCheckedChange={(checked) => 
                  setVerificationChecklist({
                    ...verificationChecklist,
                    functionalityWorks: checked === true
                  })
                }
              />
              <Label htmlFor="functionalityWorks">Functionality works properly</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="documentationComplete" 
                checked={verificationChecklist.documentationComplete}
                onCheckedChange={(checked) => 
                  setVerificationChecklist({
                    ...verificationChecklist,
                    documentationComplete: checked === true
                  })
                }
              />
              <Label htmlFor="documentationComplete">Documentation is complete</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowVerificationDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitVerification}
              disabled={loading || !Object.values(verificationChecklist).some(value => value)}
            >
              {loading ? 
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : 
                null
              }
              Verify Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
