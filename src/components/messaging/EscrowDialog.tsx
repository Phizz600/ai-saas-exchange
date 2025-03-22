
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEscrowTransaction, initializeEscrowWithApi, calculateEscrowFee, parseMessageForEscrowTerms } from "@/integrations/supabase/escrow";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EscrowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  negotiatedPrice?: number;
  productTitle: string;
  lastMessages?: { content: string, sender_id: string }[];
}

export const EscrowDialog = ({ 
  open, 
  onOpenChange, 
  conversationId,
  negotiatedPrice = 0,
  productTitle,
  lastMessages = []
}: EscrowDialogProps) => {
  const [amount, setAmount] = useState(negotiatedPrice);
  const [description, setDescription] = useState(`Purchase of ${productTitle}`);
  const [timeline, setTimeline] = useState("30 days");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [termsDetected, setTermsDetected] = useState(false);
  const { toast } = useToast();

  // Calculate fees
  const platformFee = calculatePlatformFee(amount);
  const escrowFee = calculateEscrowFee(amount);
  const total = amount + escrowFee;
  const sellerReceives = amount - platformFee;

  // Parse messages for potential escrow terms
  useEffect(() => {
    if (lastMessages && lastMessages.length > 0 && open) {
      // Combine last 5 messages into one string for analysis
      const messagesToAnalyze = lastMessages
        .slice(-5)
        .map(msg => msg.content)
        .join(" ");
      
      const extractedTerms = parseMessageForEscrowTerms(messagesToAnalyze);
      let termsFound = false;
      
      if (extractedTerms.amount && extractedTerms.amount > 0) {
        setAmount(extractedTerms.amount);
        termsFound = true;
      }
      
      if (extractedTerms.description) {
        setDescription(extractedTerms.description);
        termsFound = true;
      }
      
      if (extractedTerms.timeline) {
        setTimeline(extractedTerms.timeline);
        termsFound = true;
      }
      
      setTermsDetected(termsFound);
      
      if (termsFound) {
        toast({
          title: "Escrow Terms Detected",
          description: "We've detected potential terms from your conversation and pre-filled the form.",
        });
      }
    }
  }, [lastMessages, open, toast]);

  function calculatePlatformFee(amount: number): number {
    let feePercentage = 0.05; // Default 5%
    
    if (amount <= 10000) {
      feePercentage = 0.10; // 10%
    } else if (amount <= 50000) {
      feePercentage = 0.08; // 8%
    } else if (amount <= 100000) {
      feePercentage = 0.06; // 6%
    }
    
    return parseFloat((amount * feePercentage).toFixed(2));
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // Create the escrow transaction record
      const transaction = await createEscrowTransaction(
        conversationId,
        amount,
        description,
        timeline
      );
      
      toast({
        title: "Escrow agreement created",
        description: "Both parties will need to review and sign the agreement."
      });
      
      try {
        // Initialize the escrow with the API
        await initializeEscrowWithApi(transaction.id);
        
        toast({
          title: "Escrow transaction initialized",
          description: "The escrow transaction has been created with Escrow.com."
        });
      } catch (apiError: any) {
        setApiError(apiError.message || "Failed to connect to Escrow.com API. You can proceed manually.");
        
        toast({
          title: "API Connection Issue",
          description: "Could not connect to Escrow.com. A manual option will be provided.",
          variant: "destructive"
        });
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating escrow transaction:", error);
      toast({
        title: "Error creating escrow",
        description: error.message || "An error occurred while creating the escrow transaction.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTransactionSummary = () => {
    // Create a simple transaction object for the download
    const transaction = {
      id: Math.random().toString(36).substring(2, 10),
      conversation_id: conversationId,
      product_id: "",
      seller_id: "",
      buyer_id: "",
      amount: amount,
      platform_fee: platformFee,
      escrow_fee: escrowFee,
      description: description,
      timeline: timeline,
      status: "manual_setup",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Generate HTML content
    const htmlContent = generateEscrowSummaryForDownload(transaction);
    
    // Create a blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `escrow-transaction-${transaction.id.substring(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // This is a simplified version of the function for the frontend
  function generateEscrowSummaryForDownload(transaction: any): string {
    const summary = {
      transactionId: transaction.id.substring(0, 8),
      amount: transaction.amount,
      platformFee: transaction.platform_fee,
      escrowFee: transaction.escrow_fee,
      totalAmount: transaction.amount + transaction.platform_fee + transaction.escrow_fee,
      description: transaction.description,
      timeline: transaction.timeline || '30 days',
      status: transaction.status,
      created: transaction.created_at,
      instructions: "To complete this transaction manually on Escrow.com:"
    };

    // Generate a simple HTML for download
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Escrow Transaction Summary</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .summary { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
        .footer { margin-top: 30px; font-size: 0.9em; color: #666; }
        .amount { font-weight: bold; }
        .steps { margin-top: 20px; }
        .steps ol { padding-left: 20px; }
      </style>
    </head>
    <body>
      <h1>Escrow Transaction Summary</h1>
      <div class="summary">
        <p><strong>Transaction ID:</strong> ${summary.transactionId}</p>
        <p><strong>Description:</strong> ${summary.description}</p>
        <p><strong>Timeline:</strong> ${summary.timeline}</p>
        <p><strong>Transaction Amount:</strong> $${summary.amount.toFixed(2)}</p>
        <p><strong>Platform Fee:</strong> $${summary.platformFee.toFixed(2)}</p>
        <p><strong>Escrow Fee (estimated):</strong> $${summary.escrowFee.toFixed(2)}</p>
        <p class="amount"><strong>Total Amount:</strong> $${summary.totalAmount.toFixed(2)}</p>
        <p><strong>Status:</strong> Manual Setup</p>
        <p><strong>Created:</strong> ${new Date(summary.created).toLocaleString()}</p>
        
        <div class="steps">
          <h3>${summary.instructions}</h3>
          <ol>
            <li>Go to <a href="https://www.escrow.com" target="_blank">Escrow.com</a> and create an account if you don't have one.</li>
            <li>Select "Start a Transaction" and choose "Domain Name" as the transaction type.</li>
            <li>Enter the details exactly as shown in this summary.</li>
            <li>Follow the Escrow.com instructions to complete the transaction.</li>
            <li>Return to AI Exchange to update the transaction status.</li>
          </ol>
        </div>
      </div>
      <div class="footer">
        <p>This transaction summary was generated by AI Exchange on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
    `;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Create Escrow Transaction</DialogTitle>
          <DialogDescription className="text-center">
            Secure your transaction with Escrow.com. Both parties will need to agree to the terms.
          </DialogDescription>
        </DialogHeader>
        
        {termsDetected && (
          <Alert className="bg-blue-50 border-blue-200">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              We've detected terms from your conversation and pre-filled this form. Please review and adjust if needed.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Transaction Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="Enter amount"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's being purchased"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Input
              id="timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g., 30 days, 2 months"
            />
            <p className="text-xs text-muted-foreground">
              Timeframe for the transaction completion
            </p>
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Transaction Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Transaction Amount:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Escrow Fee:</span>
                <span>${escrowFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t mt-2">
                <span>Seller Receives:</span>
                <span>${sellerReceives.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Due:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {apiError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {apiError}
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={downloadTransactionSummary}
                    className="w-full"
                  >
                    Download Transaction Details
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || amount <= 0}
            className="min-w-[120px]"
          >
            {loading ? 
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : 
              "Create Escrow"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
