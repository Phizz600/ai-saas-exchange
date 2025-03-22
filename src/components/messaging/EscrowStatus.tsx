
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EscrowTransaction, updateEscrowStatus } from "@/integrations/supabase/escrow";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-gray-200 text-gray-800",
  agreement_reached: "bg-blue-100 text-blue-800",
  escrow_created: "bg-purple-100 text-purple-800",
  payment_secured: "bg-green-100 text-green-800",
  delivery_in_progress: "bg-yellow-100 text-yellow-800",
  inspection_period: "bg-cyan-100 text-cyan-800",
  completed: "bg-emerald-100 text-emerald-800",
  disputed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800"
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
  const { toast } = useToast();

  const getStatusActions = () => {
    const { status } = transaction;
    
    if (userRole === "buyer") {
      switch (status) {
        case "agreement_reached":
        case "escrow_created":
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
      onStatusChange();
    } catch (error) {
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

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Escrow Transaction</CardTitle>
          <Badge className={statusColors[transaction.status]}>
            {getStatusText(transaction.status)}
          </Badge>
        </div>
        <CardDescription>
          Transaction ID: {transaction.id.substring(0, 8)}...
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
        </div>
      </CardContent>
      {action && (
        <CardFooter className="pt-2">
          <Button 
            className="w-full"
            onClick={handleStatusUpdate}
            disabled={loading}
          >
            {loading ? 
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : 
              action.label
            }
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
