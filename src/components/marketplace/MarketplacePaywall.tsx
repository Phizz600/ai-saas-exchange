import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { useStripeInitialization } from "@/hooks/payments/useStripeInitialization";
import { MarketplaceSubscriptionForm } from "./MarketplaceSubscriptionForm";
import { useMarketplaceSubscription } from "@/hooks/payments/useMarketplaceSubscription";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
interface MarketplacePaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
export function MarketplacePaywall({
  isOpen,
  onClose,
  onSuccess
}: MarketplacePaywallProps) {
  const navigate = useNavigate();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const {
    stripePromise,
    error: stripeError
  } = useStripeInitialization();
  const {
    paymentClientSecret,
    subscriptionId,
    isProcessing,
    paymentError,
    subscriptionDetails,
    initiatePayment,
    handlePaymentSuccess,
    resetPayment
  } = useMarketplaceSubscription({
    onSuccess: () => {
      setShowPaymentForm(false);
      onSuccess?.();
      onClose();
    }
  });
  const benefits = ["Access 100+ exclusive AI business listings", "Advanced analytics on all marketplace products", "Verified seller badges and trust signals", "Direct messaging with sellers & priority support", "Save unlimited products to your watchlist", "Early access to new premium listings"];
  useEffect(() => {
    if (paymentClientSecret) {
      setShowPaymentForm(true);
    }
  }, [paymentClientSecret]);
  const handleUpgrade = async () => {
    await initiatePayment();
  };
  const handleCancel = () => {
    setShowPaymentForm(false);
    resetPayment();
  };
  return <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[#0A0F1E] border-[#1E293B] text-white [&>button]:hidden" onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()}>

        {!showPaymentForm ? <div className="space-y-6 py-2">
            {/* Back Button */}
            <button onClick={() => {
          onClose();
          navigate(-1);
        }} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </button>

            {/* Header with Clock Icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#F59E0B]/20 p-2 rounded-full">
                <Lock className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <h2 className="text-2xl font-bold exo-2-heading">Marketplace Premium Access</h2>
            </div>

            {/* Gradient Pricing Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#7C3AED]/30 via-[#A855F7]/20 to-[#D946EF]/30 rounded-2xl p-8 border border-[#7C3AED]/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 to-transparent" />
              
              <div className="relative text-center space-y-3">
                <p className="text-[#F59E0B] text-sm font-bold tracking-wider">LIMITED TIME </p>
                <h3 className="text-4xl font-bold">EARLY BIRD SPECIAL</h3>
                <p className="text-gray-300 text-lg">Access a private deal flow network of verified, cash-flowing AI SaaS businesses for sale — all founder-submitted, no brokers.</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-4">
                
                <div className="flex flex-col items-center">
                  <span className="text-6xl font-bold">$49.95</span>
                  <span className="text-lg text-gray-400">per month</span>
                </div>
              </div>
              <p className="text-[#F59E0B] text-xl font-semibold">You Save $50!</p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <h4 className="text-xl font-semibold mb-4">You still get everything:</h4>
              {benefits.map((benefit, index) => <div key={index} className="flex items-center gap-3">
                  <div className="bg-[#F59E0B]/20 p-1 rounded-full">
                    <Check className="h-5 w-5 text-[#F59E0B]" />
                  </div>
                  <p className="text-gray-300">{benefit}</p>
                </div>)}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button onClick={handleUpgrade} disabled={isProcessing} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#A855F7] hover:opacity-90 transition-all text-white" size="lg">
                {isProcessing ? <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting up payment...
                  </> : "Get 50% Off - Pay $49.95"}
              </Button>

              <Button onClick={() => {
            onClose();
            navigate(-1);
          }} variant="outline" className="w-full h-12 text-base bg-white/10 border-white/20 text-white hover:bg-white/20">
                No Thanks, I'll go back.
              </Button>
            </div>
          </div> : <div className="space-y-6 py-4">
            <button onClick={handleCancel} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </button>

            {(paymentError || stripeError) && <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {paymentError || stripeError}
                </AlertDescription>
              </Alert>}

            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold mb-2">Complete Your Subscription</h3>
              <p className="text-sm text-muted-foreground">Secure payment powered by Stripe</p>
            </div>

            {paymentClientSecret && stripePromise ? <Elements stripe={stripePromise} options={{
          clientSecret: paymentClientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#8B5CF6'
            }
          }
        }}>
                <MarketplaceSubscriptionForm onSuccess={handlePaymentSuccess} onCancel={handleCancel} />
              </Elements> : <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>}
          </div>}
      </DialogContent>
    </Dialog>;
}