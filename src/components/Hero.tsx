import { lazy, Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

// Lazy load components
const NewsletterSubscription = lazy(() => import("./hero/NewsletterSubscription"));
const FeatureHighlights = lazy(() => import("./hero/FeatureHighlights"));
const AnimatedBackground = lazy(() => import("./hero/AnimatedBackground"));
const HeroTitle = lazy(() => import("./hero/HeroTitle"));
const HowItWorks = lazy(() => import("./hero/HowItWorks"));
const SecurityFeatures = lazy(() => import("./hero/SecurityFeatures"));
const RoleInfo = lazy(() => import("./hero/RoleInfo"));

const Hero = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(342);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isBuyerOpen, setIsBuyerOpen] = useState(false);
  
  const words = ["SaaS", "Bots", "Apps", "Tools", "Startups", "APIs", "Products", "Solutions", "Algorithms", "Models", "Agents", "Platforms"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleListProduct = async () => {
    console.log('Session state:', session); // Debug log

    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to list your AI product",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      console.log('Attempting to navigate to /list-product'); // Debug log
      navigate('/list-product');
    } catch (error) {
      console.error('Navigation error:', error); // Debug log
      toast({
        title: "Navigation Error",
        description: "Unable to access the listing form. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <Suspense fallback={<Skeleton className="h-48" />}>
            <HeroTitle currentWordIndex={currentWordIndex} words={words} />
          </Suspense>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto text-center"
          >
            AI SaaS tools and companies drop in price until sold. Secure deals faster with timed auctions. Unlock exclusive access to premium deals and accelerate the growth of your AI portfolio.
          </motion.p>

          <div className="flex flex-col gap-6 items-center">
            <RainbowButton 
              onClick={handleListProduct} 
              className="text-lg py-6 px-12"
            >
              List your AI Product Now
            </RainbowButton>
            <Suspense fallback={<Skeleton className="w-full max-w-md h-32" />}>
              <NewsletterSubscription
                newsletterEmail={newsletterEmail}
                setNewsletterEmail={setNewsletterEmail}
                subscriberCount={subscriberCount}
                setSubscriberCount={setSubscriberCount}
              />
            </Suspense>
          </div>

          <Suspense fallback={<Skeleton className="h-16" />}>
            <SecurityFeatures />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64" />}>
            <HowItWorks />
          </Suspense>

          <Suspense fallback={<Skeleton className="w-full h-48 mt-16" />}>
            <FeatureHighlights />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64" />}>
            <RoleInfo
              isSellerOpen={isSellerOpen}
              setIsSellerOpen={setIsSellerOpen}
              isBuyerOpen={isBuyerOpen}
              setIsBuyerOpen={setIsBuyerOpen}
            />
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
