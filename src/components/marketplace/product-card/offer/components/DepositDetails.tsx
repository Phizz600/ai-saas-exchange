
import React from "react";
import { Info } from "lucide-react";

interface DepositDetailsProps {
  productTitle: string;
  offerAmount: number;
  depositAmount: number;
  platformFee: number;
  totalAmount: number;
}

export function DepositDetails({
  productTitle,
  offerAmount,
  depositAmount,
  platformFee,
  totalAmount
}: DepositDetailsProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-md">
        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p>This deposit confirms your serious interest and will be:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Applied to your full payment if the offer is accepted</li>
            <li>Fully refunded if the offer is declined</li>
            <li>Securely held in escrow throughout the process</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Deposit Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Product:</span>
            <span className="font-medium">{productTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Offer Amount:</span>
            <span className="font-medium">${offerAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Deposit (10%):</span>
            <span className="font-medium">${depositAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform Fee:</span>
            <span className="font-medium">${platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t mt-2">
            <span className="text-gray-800 font-medium">Total Due Now:</span>
            <span className="font-bold">${totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
