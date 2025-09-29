import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, Zap, Shield, Star, Sparkles } from "lucide-react";
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
    { icon: Sparkles, text: "Access all 100+ AI SaaS businesses for sale" },
    { icon: Zap, text: "Place unlimited bids and offers" },
    { icon: Shield, text: "Premium buyer verification badge" },
    { icon: Star, text: "Early access to new listings" },
    { icon: Check, text: "Direct messaging with sellers" },
    { icon: Check, text: "Advanced marketplace analytics" },
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Unlock the Full Marketplace
          </DialogTitle>
          <p className="text-muted-foreground text-lg">
            Join 500+ premium investors accessing exclusive AI SaaS opportunities
          </p>
        </DialogHeader>

        {!showPaymentForm ? (
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="text-center space-y-4">
                <Badge variant="secondary" className="px-4 py-1">
                  Most Popular
                </Badge>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold">$49.95</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Cancel anytime • No long-term commitment</p>
                </div>
              </div>
            </Card>

            {/* Benefits List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">What you get with Premium:</h3>
              <div className="grid gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center space-y-2 py-4 border-t border-border">
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                "Found my perfect acquisition in just 2 weeks" - Premium Member
              </p>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleUpgrade} 
              size="lg" 
              className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              Start Premium Access - $49.95/month
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by Stripe • Cancel anytime in your account settings
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Complete Your Subscription</h3>
              <p className="text-muted-foreground">Secure payment powered by Stripe</p>
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