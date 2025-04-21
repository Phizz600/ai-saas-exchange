
import React from "react";
import { Button } from "@/components/ui/button";

interface EscrowPaymentButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const EscrowPaymentButton: React.FC<EscrowPaymentButtonProps> = ({
  onClick,
  disabled = false
}) => (
  <div className="flex justify-center mb-6">
    <Button
      className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white font-semibold px-8 py-3 shadow-lg rounded-lg"
      size="lg"
      onClick={onClick}
      disabled={disabled}
    >
      Initiate Escrow Payment
    </Button>
  </div>
);

export default EscrowPaymentButton;
