import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Crown } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { useStripeInitialization } from "@/hooks/payments/useStripeInitialization";
import { usePackagePayment } from "@/hooks/payments/usePackagePayment";
import { PackagePaymentForm } from "./PackagePaymentForm";
import { PackageDownsellDialog } from "./PackageDownsellDialog";
import { FeaturedListingDownsellDialog } from "./FeaturedListingDownsellDialog";

interface PackagePaymentDialogProps {
  open: boolean;
  onClose: () => void;
  packageType: 'featured-listing' | 'premium-exit';
  onSuccess: () => void;
}

export function PackagePaymentDialog({ 
  open, 
  onClose, 
  packageType, 
  onSuccess 
}: PackagePaymentDialogProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDownsell, setShowDownsell] = useState(false);
  const [showSecondaryDownsell, setShowSecondaryDownsell] = useState(false);
  const { stripePromise, error: stripeError } = useStripeInitialization();
  
  const {
    paymentClientSecret,
    isProcessing,
    paymentError,
    packageDetails,
    initiatePayment,
    handlePaymentSuccess,
    resetPayment
  } = usePackagePayment({ 
    packageType, 
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  useEffect(() => {
    setShowPaymentForm(!!paymentClientSecret);
  }, [paymentClientSecret]);

  useEffect(() => {
    if (!open) {
      setShowPaymentForm(false);
      setShowDownsell(false);
      setShowSecondaryDownsell(false);
      resetPayment();
    }
  }, [open]);

  const handleCancel = () => {
    // Only show downsell for paid packages
    if (packageType === 'featured-listing' || packageType === 'premium-exit') {
      setShowDownsell(true);
    } else {
      onClose();
    }
  };

  const handleDownsellClose = () => {
    setShowDownsell(false);
    onClose();
  };

  const handleSecondaryDownsell = () => {
    setShowDownsell(false);
    setShowSecondaryDownsell(true);
  };

  const handleSecondaryDownsellClose = () => {
    setShowSecondaryDownsell(false);
    onClose();
  };

  const handleInitiatePayment = async () => {
    const success = await initiatePayment();
    if (success) {
      setShowPaymentForm(true);
    }
  };

  const packageFeatures = {
    'featured-listing': [
      "Reduced Success Fees (5% vs 10%)",
      "Featured in weekly newsletter",
      "Advanced Playbook & Templates",
      "Exit Readiness Checklist",
      "30-day Money-back Guarantee"
    ],
    'premium-exit': [
      "Everything in Featured Listing Package",
      "$0 Success Fees",
      "Dedicated Sales Rep",
      "AMA Hot Spot Pitch",
      "30-min Exit Strategy Call",
      "Priority Placement"
    ]
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {packageType === 'premium-exit' ? (
              <Crown className="h-5 w-5 text-amber-400" />
            ) : (
              <CheckCircle className="h-5 w-5 text-purple-400" />
            )}
            {packageDetails.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              ${packageDetails.amount}
            </div>
            <p className="text-sm text-gray-400">One-time payment</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white">Package includes:</h4>
            <ul className="space-y-1">
              {packageFeatures[packageType].map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-300">
                  <CheckCircle className={`h-4 w-4 mr-2 flex-shrink-0 ${
                    packageType === 'premium-exit' ? 'text-amber-400' : 'text-purple-400'
                  }`} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {stripeError && (
            <div className="text-red-400 text-sm text-center">
              {stripeError}
            </div>
          )}

          {paymentError && (
            <div className="text-red-400 text-sm text-center">
              {paymentError}
            </div>
          )}

          {!showPaymentForm ? (
            <div className="space-y-3">
              <Button
                onClick={handleInitiatePayment}
                disabled={isProcessing || !!stripeError}
                className={`w-full ${
                  packageType === 'premium-exit' 
                    ? 'bg-amber-500 hover:bg-amber-600' 
                    : 'bg-purple-500 hover:bg-purple-600'
                } text-black font-semibold`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up payment...
                  </>
                ) : (
                  `Purchase ${packageDetails.name}`
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          ) : (
            stripePromise && paymentClientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: paymentClientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: packageType === 'premium-exit' ? '#f59e0b' : '#8b5cf6',
                    },
                  },
                }}
              >
                <PackagePaymentForm
                  onSuccess={handlePaymentSuccess}
                  onCancel={onClose}
                  packageName={packageDetails.name}
                  amount={packageDetails.amount}
                />
              </Elements>
            )
          )}
        </div>
      </DialogContent>
      
      <PackageDownsellDialog
        open={showDownsell}
        onClose={handleDownsellClose}
        originalPackageType={packageType}
        onSuccess={onSuccess}
        onSecondaryDownsell={handleSecondaryDownsell}
      />
      
      <FeaturedListingDownsellDialog
        open={showSecondaryDownsell}
        onClose={handleSecondaryDownsellClose}
        onSuccess={onSuccess}
      />
    </Dialog>
  );
}