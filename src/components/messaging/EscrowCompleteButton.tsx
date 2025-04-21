
import React from "react";
import { Button } from "@/components/ui/button";
import { useEscrowCompletion } from "./hooks/useEscrowCompletion";

interface EscrowCompleteButtonProps {
  escrowTransactionId: string;
  canComplete: boolean; // Only true if current user is eligible
  onCompleted: () => void;
}

export function EscrowCompleteButton({ escrowTransactionId, canComplete, onCompleted }: EscrowCompleteButtonProps) {
  const { completeTransaction, isLoading } = useEscrowCompletion({ escrowTransactionId, onCompleted });

  if (!canComplete) return null;

  return (
    <Button onClick={completeTransaction} disabled={isLoading} variant="default">
      {isLoading ? "Completing..." : "Release Funds & Complete"}
    </Button>
  );
}
