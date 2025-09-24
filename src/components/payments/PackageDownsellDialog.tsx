import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Crown, Clock } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { useStripeInitialization } from "@/hooks/payments/useStripeInitialization";
import { usePackagePayment } from "@/hooks/payments/usePackagePayment";
import { PackagePaymentForm } from "./PackagePaymentForm";

interface PackageDownsellDialogProps {
  open: boolean;
  onClose: () => void;
  originalPackageType: 'featured-listing' | 'premium-exit';
  onSuccess: () => void;
  onSecondaryDownsell?: () => void;
  onContinueWithFree?: () => void;
}

export function PackageDownsellDialog({ 
  open, 
  onClose, 
  originalPackageType, 
  onSuccess,
  onSecondaryDownsell,
  onContinueWithFree
}: PackageDownsellDialogProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { stripePromise, error: stripeError } = useStripeInitialization();
  
  // Convert to downsell package type
  const downsellPackageType = `${originalPackageType}-downsell` as 'featured-listing-downsell' | 'premium-exit-downsell';
  
  const {
    paymentClientSecret,
    isProcessing,
    paymentError,
    packageDetails,
    initiatePayment,
    handlePaymentSuccess,
    resetPayment
  } = usePackagePayment({ 
    packageType: downsellPackageType, 
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
      resetPayment();
    }
  }, [open]);

  const handleInitiatePayment = async () => {
    const success = await initiatePayment();
    if (success) {
      setShowPaymentForm(true);
    }
  };

  const originalPricing = {
    'featured-listing': { amount: 199, name: 'Featured Listing Package' },
    'premium-exit': { amount: 2500, name: 'Premium Exit Package' }
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

  const originalPrice = originalPricing[originalPackageType].amount;
  const downsellPrice = packageDetails.amount;
  const savings = originalPrice - downsellPrice;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            Wait! Special Offer
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center bg-gradient-to-r from-amber-500/20 to-purple-500/20 p-4 rounded-lg border border-amber-500/30">
            <div className="text-sm text-amber-400 font-semibold mb-1">LIMITED TIME OFFER</div>
            <div className="text-2xl font-bold text-white mb-1">
              Get 50% Off Now!
            </div>
            <div className="text-sm text-gray-300">
              Same great features, half the price
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg text-gray-400 line-through">${originalPrice}</span>
              <span className="text-3xl font-bold text-white">${downsellPrice}</span>
            </div>
            <div className="text-sm text-amber-400 font-semibold">
              You Save ${savings}!
            </div>
            <p className="text-sm text-gray-400">One-time payment</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white">You still get everything:</h4>
            <ul className="space-y-1">
              {packageFeatures[originalPackageType].map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-300">
                  <CheckCircle className={`h-4 w-4 mr-2 flex-shrink-0 ${
                    originalPackageType === 'premium-exit' ? 'text-amber-400' : 'text-purple-400'
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
                className="w-full bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-600 hover:to-purple-600 text-black font-semibold"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up payment...
                  </>
                ) : (
                  `Get 50% Off - Pay $${downsellPrice}`
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  if (originalPackageType === 'premium-exit' && onSecondaryDownsell) {
                    onSecondaryDownsell();
                  } else if (onContinueWithFree) {
                    onContinueWithFree();
                  } else {
                    onClose();
                  }
                }}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                No Thanks, Continue with Free Listing
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
                      colorPrimary: '#f59e0b',
                    },
                  },
                }}
              >
                <PackagePaymentForm
                  onSuccess={handlePaymentSuccess}
                  onCancel={onClose}
                  packageName={`${packageDetails.name} (50% Off)`}
                  amount={packageDetails.amount}
                />
              </Elements>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}