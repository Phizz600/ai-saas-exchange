
import React from "react";

interface DepositDetailsProps {
  productTitle: string;
  offerAmount: number;
  depositAmount: number;
  platformFee: number;
  totalAmount: number;
  isAdditionalDeposit?: boolean;
}

export function DepositDetails({
  productTitle,
  offerAmount,
  depositAmount,
  platformFee,
  totalAmount,
  isAdditionalDeposit = false
}: DepositDetailsProps) {
  return (
    <div className="my-4 border border-gray-200 rounded-md overflow-hidden">
      <div className="bg-gray-50 p-3 border-b border-gray-200">
        <h3 className="font-medium">Deposit Summary</h3>
        <p className="text-sm text-gray-600">{productTitle}</p>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span>Offer Amount</span>
          <span className="font-medium">${offerAmount.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span>{isAdditionalDeposit ? "Additional Deposit (10%)" : "Deposit (10%)"}</span>
          <span className="font-medium">${depositAmount.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Platform Fee (5% of deposit)</span>
          <span>${platformFee.toLocaleString()}</span>
        </div>
        
        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center font-semibold">
          <span>Total to Pay Now</span>
          <span>${totalAmount.toLocaleString()}</span>
        </div>
        
        <p className="text-xs text-gray-500 italic mt-2">
          {isAdditionalDeposit 
            ? "This additional deposit is required because your updated offer is more than 20% higher than your original offer."
            : "Your deposit will be applied to the final purchase price if your offer is accepted or fully refunded if declined."}
        </p>
      </div>
    </div>
  );
}
