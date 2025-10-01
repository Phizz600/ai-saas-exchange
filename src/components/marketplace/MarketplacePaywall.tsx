import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SubscriptionPaymentForm } from "./SubscriptionPaymentForm";
import { toast } from "sonner";
interface MarketplacePaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
const stripePromise = loadStripe(process.env.NODE_ENV === 'production' ? 'pk_live_...' // Replace with your live publishable key
: 'pk_test_51QKKo5RnEQ2q3dOKQRdBFUybtH7Bg7J6nkjgowfJYjJLn3Z3jjk3gqt6jHexLQ1hhWajgqz4wMWYGfWwQNJfp9za00xXyPDbNZ' // Your test key
);
export function MarketplacePaywall({
  isOpen,
  onClose,
  onSuccess
}: MarketplacePaywallProps) {
  const navigate = useNavigate();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const benefits = ["Access 100+ exclusive AI business listings", "Advanced analytics on all marketplace products", "Verified seller badges and trust signals", "Direct messaging with sellers & priority support", "Save unlimited products to your watchlist", "Early access to new premium listings"];
  const handleUpgrade = () => {
    setShowPaymentForm(true);
  };
  const handlePaymentSuccess = () => {
    toast.success("Welcome to Premium!", {
      description: "You now have full access to the marketplace."
    });
    setShowPaymentForm(false);
    onSuccess?.();
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[#0A0F1E] border-[#1E293B] text-white [&>button]:hidden" onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()}>

        {!showPaymentForm ? <div className="space-y-6 py-2">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </button>

            {/* Header with Clock Icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#F59E0B]/20 p-2 rounded-full">
                <Lock className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <h2 className="text-2xl font-bold exo-2-heading">Marketplace Unlock </h2>
            </div>

            {/* Gradient Pricing Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#7C3AED]/30 via-[#A855F7]/20 to-[#D946EF]/30 rounded-2xl p-8 border border-[#7C3AED]/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 to-transparent" />
              
              <div className="relative text-center space-y-3">
                <p className="text-[#F59E0B] text-sm font-bold tracking-wider">LIMITED TIME EARLY INSIDER OFFER</p>
                <h3 className="text-4xl font-bold">Get 50% Off Now!</h3>
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
              <Button onClick={handleUpgrade} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#A855F7] hover:opacity-90 transition-all text-white" size="lg">
                Get 50% Off - Pay $49.95
              </Button>

              <Button onClick={() => navigate(-1)} variant="outline" className="w-full h-12 text-base bg-white/10 border-white/20 text-white hover:bg-white/20">
                No Thanks, I'll go back.
              </Button>
            </div>
          </div> : <div className="space-y-6 py-4">
            <button onClick={() => setShowPaymentForm(false)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </button>
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold mb-2">Complete Your Subscription</h3>
              <p className="text-sm text-muted-foreground">Secure payment powered by Stripe</p>
            </div>
            <Elements stripe={stripePromise}>
              <SubscriptionPaymentForm onSuccess={handlePaymentSuccess} onCancel={() => setShowPaymentForm(false)} />
            </Elements>
          </div>}
      </DialogContent>
    </Dialog>;
}