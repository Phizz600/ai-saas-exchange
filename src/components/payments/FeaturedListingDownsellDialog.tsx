import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { useStripeInitialization } from "@/hooks/payments/useStripeInitialization";
import { usePackagePayment } from "@/hooks/payments/usePackagePayment";
import { PackagePaymentForm } from "./PackagePaymentForm";

interface FeaturedListingDownsellDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FeaturedListingDownsellDialog({ 
  open, 
  onClose, 
  onSuccess 
}: FeaturedListingDownsellDialogProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
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
    packageType: 'featured-listing', 
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

  const packageFeatures = [
    "Reduced Success Fees (5% vs 10%)",
    "Featured in weekly newsletter",
    "Advanced Playbook & Templates",
    "Exit Readiness Checklist",
    "30-day Money-back Guarantee"
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-purple-400" />
            One Final Offer
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">
              Don't Miss Out Completely!
            </h3>
            <p className="text-gray-300 text-sm">
              Since the Premium Exit Package isn't right for you, how about our Featured Listing Package?
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
            <div className="text-center space-y-3">
              <div className="text-2xl font-bold text-white">
                ${packageDetails.amount}
              </div>
              <p className="text-sm text-gray-300">
                Much better than a free listing
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white text-center">You'll get:</h4>
            <ul className="space-y-2">
              {packageFeatures.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0 text-purple-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/30">
            <p className="text-xs text-center text-purple-300">
              <strong>Limited Time:</strong> This is your final opportunity to upgrade your listing before proceeding with the free option.
            </p>
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
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting up payment...
                  </>
                ) : (
                  `Get Featured Listing - $${packageDetails.amount}`
                )}
              </Button>
              
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
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
                      colorPrimary: '#8b5cf6',
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
    </Dialog>
  );
}