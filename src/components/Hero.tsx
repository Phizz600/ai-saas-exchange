import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, ShieldCheck, LockKeyhole } from "lucide-react";

// Lazy load components
const AnimatedWord = lazy(() => import("./hero/AnimatedWord"));
const NewsletterSubscription = lazy(() => import("./hero/NewsletterSubscription"));
const FeatureHighlights = lazy(() => import("./hero/FeatureHighlights"));
const AnimatedBackground = lazy(() => import("./hero/AnimatedBackground"));

const Hero = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(342);
  const navigate = useNavigate();
  
  const words = ["Companies", "Businesses", "Apps", "Plugins", "Tools", "MVPs", "Bots"];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-accent via-accent2 to-accent3" />}>
        <AnimatedBackground />
      </Suspense>

      <div className="relative container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center mb-8"
          >
            <h1 className="font-exo text-5xl md:text-7xl font-bold leading-tight">
              The AI Dutch Auction
              <br />
              <span className="text-white">Marketplace</span>
              <span className="bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] text-transparent bg-clip-text">
                : Bid, Buy, or Sell at the Perfect Price
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto"
          >
            AI Tools and companies drop in price until sold. Secure deals faster with timed auctions. Unlock exclusive access to premium deals and accelerate the growth of your AI portfolio.
          </motion.p>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-200">Escrow-protected transactions</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-200">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <LockKeyhole className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-200">Verified AI Startups</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <Suspense fallback={<Skeleton className="w-full max-w-md h-32" />}>
              <NewsletterSubscription
                newsletterEmail={newsletterEmail}
                setNewsletterEmail={setNewsletterEmail}
                subscriberCount={subscriberCount}
                setSubscriberCount={setSubscriberCount}
              />
            </Suspense>
          </div>

          {/* How it Works Section */}
          <div className="mt-16 space-y-8">
            <h2 className="text-3xl font-bold text-white">How it Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              >
                <div className="text-2xl font-bold text-white mb-2">1</div>
                <h3 className="text-xl font-semibold text-white mb-3">List Your Product</h3>
                <p className="text-gray-300">List your AI product, company, tool, etc, with a starting price.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              >
                <div className="text-2xl font-bold text-white mb-2">2</div>
                <h3 className="text-xl font-semibold text-white mb-3">Watch Prices Drop</h3>
                <p className="text-gray-300">Buyers bid as the price drops daily/hourly.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
              >
                <div className="text-2xl font-bold text-white mb-2">3</div>
                <h3 className="text-xl font-semibold text-white mb-3">Secure the Deal</h3>
                <p className="text-gray-300">The highest bidder at the end of the auction wins if the buyer agrees to sell.</p>
              </motion.div>
            </div>
          </div>

          <Suspense fallback={<Skeleton className="w-full h-48 mt-16" />}>
            <FeatureHighlights />
          </Suspense>

          <div className="mt-8 text-sm text-gray-200">
            ✓ Free AI Valuations &nbsp; • &nbsp; ✓ Secure Platform &nbsp; • &nbsp; ✓ Premium Network
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;