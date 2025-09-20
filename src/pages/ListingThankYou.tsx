import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, Timer, Youtube, Twitter, Instagram, Rss, MousePointerClick, AlertCircle, CheckCircle, Clock, Mail, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
export const ListingThankYou = () => {
  const [queueNumber, setQueueNumber] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [paymentNeeded, setPaymentNeeded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  useEffect(() => {
    // Check for product ID in URL params first, then session storage as fallback
    const params = new URLSearchParams(location.search);
    const urlProductId = params.get('product_id');
    const paymentStatus = params.get('payment_status');
    const paymentNeededParam = params.get('payment_needed');
    console.log("URL parameters:", {
      urlProductId,
      paymentStatus,
      paymentNeededParam,
      fullUrl: window.location.href
    });

    // First try to get product ID from URL params
    if (urlProductId) {
      setProductId(urlProductId);
      console.log("Found product ID in URL:", urlProductId);
    } else {
      // Fallback to session storage
      const pendingProductId = sessionStorage.getItem('pendingProductId');
      if (pendingProductId) {
        setProductId(pendingProductId);
        console.log("Found pending product ID in session storage:", pendingProductId);
      } else {
        console.log("No product ID found in URL or session storage");
        // Still show the page even without a product ID
      }
    }

    // Check if redirected from payment success
    if (paymentStatus === 'success') {
      setIsPaid(true);
      setLoadingMessage("Verifying payment status...");

      // If we have both payment success and a product ID, update the payment status
      const idToUpdate = urlProductId || sessionStorage.getItem('pendingProductId');
      if (idToUpdate) {
        updatePaymentStatus(idToUpdate);
      } else {
        console.log("Payment successful but no product ID found to update");
        setLoadingMessage(null);
      }
    }

    // Check if payment is still needed
    if (paymentNeededParam === 'true') {
      setPaymentNeeded(true);
    }

    // Generate a random number between 1 and 207
    const randomNumber = Math.floor(Math.random() * 207) + 1;
    setQueueNumber(randomNumber);
  }, [location.search]); // Update when location search changes

  const updatePaymentStatus = async (productId: string) => {
    setIsProcessing(true);
    try {
      console.log("Updating payment status for product:", productId);
      const {
        error
      } = await supabase.from('products').update({
        payment_status: 'paid'
      }).eq('id', productId);
      if (error) {
        console.error("Error updating payment status:", error);
        toast({
          title: "Payment Verification Error",
          description: "We couldn't verify your payment status. Please contact support.",
          variant: "destructive"
        });
      } else {
        console.log("Payment status updated successfully for product:", productId);
        // Clear from session storage after successful update
        sessionStorage.removeItem('pendingProductId');
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setIsProcessing(false);
      setLoadingMessage(null);
    }
  };
  const retryPayment = () => {
    if (productId) {
      // Use origin to ensure proper URL construction
      const currentHost = window.location.origin;
      const successUrl = `${currentHost}/listing-thank-you?payment_status=success&product_id=${productId}`;
      console.log("Redirecting to payment page with success URL:", successUrl);
      window.location.href = `https://buy.stripe.com/9AQ3dz3lmf2yccE288?client_reference_id=${productId}&success_url=${encodeURIComponent(successUrl)}`;
    } else {
      toast({
        title: "Product Information Missing",
        description: "We couldn't find your product information. Please try submitting again.",
        variant: "destructive"
      });
      navigate('/list-product');
    }
  };
  return <AnimatedGradientBackground>
      <div className="container mx-auto px-4 py-4 sm:py-8 text-slate-950">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 bg-white/90 rounded-xl shadow-xl p-4 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            <Link to="/">
              <img src="/lovable-uploads/f74b20e6-6798-4aeb-badd-2da6c2dce40b.png" alt="AI Exchange Logo" className="w-16 h-16 sm:w-24 sm:h-24 object-contain animate-float hover:opacity-80 transition-opacity" />
            </Link>
            <h1 className="text-2xl sm:text-4xl exo-2-heading font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text text-center px-2">
              Thank You for Your Submission!
            </h1>

            <div className="space-y-4 text-center max-w-xl px-2">
              <p className="text-base sm:text-lg text-gray-700 font-medium">
                Thank you for listing your AI SaaS business on AI Exchange Club! You're in good hands! Here's what happens next:
              </p>
            </div>

            {/* What Happens Next Section */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 border border-purple-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">What Happens Next</h2>
              
              <div className="space-y-6">
                {/* Step 1: Review Process */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-[#8B5CF6]" />
                      Review Process
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Our team will vet your submission within 24-48 hours.
                    </p>
                    <p className="text-gray-600">
                      You'll get an approval or rejection email. Be on the lookout.
                    </p>
                  </div>
                </div>

                {/* Step 2: Buyer Outreach */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-[#8B5CF6]" />
                      Buyer Outreach
                    </h3>
                    <p className="text-gray-600 mb-2">
                      If approved, we'll notify our Premium Buyer Network.
                    </p>
                    <p className="text-gray-600">
                      Buyers will contact you via your email (keep an eye out!).
                    </p>
                  </div>
                </div>

                {/* Step 3: Prepare for Due Diligence */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-[#8B5CF6]" />
                      Prepare for Due Diligence
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Gather: Revenue proof, traffic proof, tech docs, and demo access.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-800 text-sm font-medium">We're excited to help you exit! 🚀</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Closing Message */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-lg font-medium text-gray-800 mb-2">
                  We're excited to help you sell! 🚀
                </p>
                <p className="text-gray-600 flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2 text-[#8B5CF6]" />
                  Questions? Reach me at{" "}
                  <a href="mailto:support@aiexchange.club" className="text-[#8B5CF6] hover:text-[#D946EF] font-medium ml-1">
                    support@aiexchange.club
                  </a>
                </p>
                <p className="text-gray-500 text-sm mt-2 font-medium">
                  — The AI Exchange Club
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-center max-w-xl px-2">
              <p className="text-sm sm:text-base text-gray-600 italic">
                Keep an eye on your email for updates about your listing and our launch.
              </p>
            </div>

            {/* Queue Position Card */}
            
            
            <a href="https://aiexchangeclub.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" className="w-full px-4 sm:px-0">
              <Button className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90 text-sm sm:text-base py-4 sm:py-6 flex items-center justify-center gap-2 sm:gap-3">
                <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Join the AI Exchange Club Newsletter</span>
              </Button>
            </a>

            {/* Social Proof Section */}
            <div className="w-full max-w-md p-4 bg-purple-50 rounded-lg mx-4 sm:mx-0">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#8B5CF6]" />
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Join 1,000+ AI Founders</span>
              </div>
              <div className="space-y-2">
                <Progress value={80} className="h-2 bg-purple-100" />
                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="font-semibold text-[#D946EF]">Only 200 spots left!</span> Be part of the first wave of AI innovators.
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 max-w-md px-4 sm:px-0">
              Join our exclusive AI Exchange Club newsletter and unlock:
              <ul className="mt-2 space-y-1 pl-0">
                <li className="text-left">✨ Early access to marketplace features</li>
                <li className="text-left">💎 Exclusive AI industry insights</li>
                <li className="text-left">🚀 Priority listing opportunities</li>
                <li className="text-left">🤝 Network with fellow AI innovators</li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="w-full max-w-md text-center mt-6 sm:mt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Follow Us</h3>
              <div className="flex justify-center space-x-4">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#FF0000] transition-colors">
                  <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#1DA1F2] transition-colors">
                  <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#E4405F] transition-colors">
                  <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
                <a href="https://aiexchangeclub.beehiiv.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#FFA500] transition-colors">
                  <Rss className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedGradientBackground>;
};