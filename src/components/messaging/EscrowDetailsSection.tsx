import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Clock, Download, FileText, ShieldAlert, ShieldCheck } from "lucide-react";
import { EscrowPaymentDialog } from "./EscrowPaymentDialog";
import { EscrowDeliveryDialog } from "./EscrowDeliveryDialog";
import { EscrowTransaction } from "@/integrations/supabase/escrow";
import { EscrowCompleteButton } from "./EscrowCompleteButton";

interface EscrowDetailsSectionProps {
  escrowTransaction: EscrowTransaction;
  currentUserId: string;
  onStatusChange: () => void;
}

export function EscrowDetailsSection({ escrowTransaction, currentUserId, onStatusChange }: EscrowDetailsSectionProps) {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);

  if (!escrowTransaction) return null;

  const isBuyer = currentUserId === escrowTransaction.buyer_id;
  const isSeller = currentUserId === escrowTransaction.seller_id;

  // Format the escrow status for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get the appropriate badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'agreement_reached':
        return 'bg-blue-100 text-blue-800';
      case 'payment_secured':
        return 'bg-green-100 text-green-800';
      case 'delivery_in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'inspection_period':
        return 'bg-purple-100 text-purple-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get the appropriate action button based on status and user role
  const getActionButton = () => {
    if (escrowTransaction.status === 'agreement_reached' && isBuyer) {
      return (
        <Button 
          onClick={() => setIsPaymentDialogOpen(true)}
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
        >
          Secure Payment in Escrow
        </Button>
      );
    }

    if (escrowTransaction.status === 'payment_secured' && isSeller) {
      return (
        <Button 
          onClick={() => setIsDeliveryDialogOpen(true)}
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
        >
          Confirm Delivery
        </Button>
      );
    }

    return null;
  };

  // Calculate total amount including fees
  const totalAmount = escrowTransaction.amount + escrowTransaction.platform_fee + escrowTransaction.escrow_fee;

  // Determine eligibility to complete: only buyer, and status allows
  const canComplete = escrowTransaction?.buyer_id === currentUserId 
    && escrowTransaction?.status === "inspection_period";

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          Escrow Transaction
        </CardTitle>
        <CardDescription>
          Secure payment and delivery for this transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className={`mt-1 ${getStatusBadgeColor(escrowTransaction.status)}`}>
              {formatStatus(escrowTransaction.status)}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium">${escrowTransaction.amount.toFixed(2)}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Product Price</span>
            <span className="font-medium">${escrowTransaction.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Platform Fee</span>
            <span className="text-sm">${escrowTransaction.platform_fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Escrow Fee</span>
            <span className="text-sm">${escrowTransaction.escrow_fee.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-medium">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {escrowTransaction.description && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{escrowTransaction.description}</p>
            </div>
          </>
        )}

        {escrowTransaction.timeline && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Timeline: {escrowTransaction.timeline}</span>
          </div>
        )}

        {escrowTransaction.status === 'disputed' && (
          <div className="bg-red-50 p-3 rounded-md border border-red-200">
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">This transaction is under dispute</p>
                <p className="text-sm text-red-700 mt-1">
                  Please check your messages for details on how to resolve this issue.
                </p>
              </div>
            </div>
          </div>
        )}

        {escrowTransaction.status === 'completed' && (
          <div className="bg-green-50 p-3 rounded-md border border-green-200">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Transaction Completed</p>
                <p className="text-sm text-green-700 mt-1">
                  This transaction has been successfully completed and funds have been released.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0">
        {getActionButton()}
        
        <EscrowCompleteButton
          escrowTransactionId={escrowTransaction.id}
          canComplete={canComplete}
          onCompleted={onStatusChange}
        />

        <Button variant="outline" className="flex items-center gap-2" onClick={() => {
          // Generate and download escrow summary
          const element = document.createElement('a');
          const file = new Blob([JSON.stringify(escrowTransaction, null, 2)], {type: 'application/json'});
          element.href = URL.createObjectURL(file);
          element.download = `escrow-${escrowTransaction.id.substring(0, 8)}.json`;
          document.body.appendChild(element);
          element.click();
        }}>
          <FileText className="h-4 w-4" />
          <span>Download Details</span>
        </Button>
      </CardFooter>

      <EscrowPaymentDialog 
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        transaction={escrowTransaction}
        onStatusChange={onStatusChange}
      />

      <EscrowDeliveryDialog
        open={isDeliveryDialogOpen}
        onClose={() => setIsDeliveryDialogOpen(false)}
        transaction={escrowTransaction}
        onStatusChange={onStatusChange}
      />
    </Card>
  );
}
