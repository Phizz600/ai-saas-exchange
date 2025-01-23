import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedWord } from "./hero/AnimatedWord";
import { NewsletterSubscription } from "./hero/NewsletterSubscription";
import { FeatureHighlights } from "./hero/FeatureHighlights";
import { AnimatedBackground } from "./hero/AnimatedBackground";

export const Hero = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(342);
  const navigate = useNavigate();
  
  const words = ["Companies", "Businesses", "Apps", "Plugins", "Tools", "MVPs", "Bots"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-8"
          >
            <h1 className="font-exo text-5xl md:text-7xl font-bold text-white leading-tight">
              Where AI{" "}
              <AnimatedWord words={words} currentWordIndex={currentWordIndex} />
              <br />
              <span className="bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] text-transparent bg-clip-text">
                Find Their Perfect Match
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto"
          >
            Connect with top-tier investors, pitch your AI business or idea, and participate in timed, Dutch auctions. Unlock exclusive access to premium deals and accelerate the growth of your AI company.
          </motion.p>

          <div className="flex flex-col gap-6 items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#D946EF] hover:to-[#8B5CF6] text-white px-12 py-6 text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300"
              >
                Marketplace
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>

            <NewsletterSubscription
              newsletterEmail={newsletterEmail}
              setNewsletterEmail={setNewsletterEmail}
              subscriberCount={subscriberCount}
              setSubscriberCount={setSubscriberCount}
            />
          </div>

          <FeatureHighlights />

          <div className="mt-8 text-sm text-gray-200">
            ✓ Free AI Valuations &nbsp; • &nbsp; ✓ Secure Platform &nbsp; • &nbsp; ✓ Premium Network
          </div>
        </motion.div>
      </div>
    </div>
  );
};