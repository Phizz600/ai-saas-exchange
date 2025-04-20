
import { EscrowTransaction } from "@/integrations/supabase/escrow";

interface TransactionSummaryCardProps {
  transaction: EscrowTransaction;
}

export function TransactionSummaryCard({ transaction }: TransactionSummaryCardProps) {
  return (
    <div className="bg-muted p-4 rounded-md space-y-2">
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Product Amount:</span>
        <span className="font-medium">${transaction.amount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Platform Fee:</span>
        <span className="font-medium">${transaction.platform_fee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Escrow Fee:</span>
        <span className="font-medium">${transaction.escrow_fee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between pt-2 border-t mt-2">
        <span className="font-medium">Total:</span>
        <span className="font-bold">
          ${(transaction.amount + transaction.platform_fee + transaction.escrow_fee).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
