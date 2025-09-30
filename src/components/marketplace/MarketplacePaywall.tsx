import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Shield, Star, Sparkles, TrendingUp } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SubscriptionPaymentForm } from "./SubscriptionPaymentForm";
import { toast } from "sonner";

interface MarketplacePaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const stripePromise = loadStripe(process.env.NODE_ENV === 'production' 
  ? 'pk_live_...' // Replace with your live publishable key
  : 'pk_test_51QKKo5RnEQ2q3dOKQRdBFUybtH7Bg7J6nkjgowfJYjJLn3Z3jjk3gqt6jHexLQ1hhWajgqz4wMWYGfWwQNJfp9za00xXyPDbNZ' // Your test key
);

export function MarketplacePaywall({ isOpen, onClose, onSuccess }: MarketplacePaywallProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const benefits = [
    { icon: Sparkles, text: "Access 100+ exclusive AI business listings", highlight: true },
    { icon: TrendingUp, text: "Advanced analytics on all marketplace products" },
    { icon: Shield, text: "Verified seller badges and trust signals" },
    { icon: Zap, text: "Direct messaging with sellers & priority support" },
    { icon: Check, text: "Save unlimited products to your watchlist" },
    { icon: Check, text: "Early access to new premium listings" },
  ];

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center exo-2-heading bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Unlock the Full Marketplace
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Join 1,000+ investors discovering exclusive AI business opportunities
          </DialogDescription>
        </DialogHeader>

        {!showPaymentForm ? (
          <div className="space-y-8 py-4">
            {/* Pricing Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border-2 border-primary/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
              
              <div className="relative text-center">
                <div className="inline-block mb-3 px-4 py-1 bg-primary/20 rounded-full">
                  <p className="text-sm font-semibold text-primary">LIMITED TIME OFFER</p>
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-2xl text-muted-foreground line-through">$99.95</span>
                  <span className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">$49.95</span>
                </div>
                <p className="text-lg text-muted-foreground">per month • Cancel anytime</p>
                <p className="text-sm text-primary font-semibold mt-2">🔥 50% OFF - First 100 subscribers only!</p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={index} 
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                      benefit.highlight 
                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30' 
                        : 'bg-card/50 border-border/50'
                    }`}
                  >
                    <div className={`mt-0.5 rounded-lg p-2 ${
                      benefit.highlight ? 'bg-primary/20' : 'bg-primary/10'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        benefit.highlight ? 'text-primary' : 'text-primary/70'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${benefit.highlight ? 'text-foreground' : 'text-foreground/90'}`}>
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Proof */}
            <div className="bg-muted/50 rounded-xl p-4 border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★★★★★</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                "Found my perfect AI acquisition in just 2 days. Worth every penny!" - Sarah K.
              </p>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleUpgrade}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all"
              size="lg"
            >
              Get Instant Access Now →
            </Button>

            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold mb-2">Complete Your Subscription</h3>
              <p className="text-sm text-muted-foreground">Secure payment powered by Stripe</p>
            </div>
            <Elements stripe={stripePromise}>
              <SubscriptionPaymentForm 
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPaymentForm(false)}
              />
            </Elements>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}