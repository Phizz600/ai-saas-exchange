import { lazy, Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(342);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isBuyerOpen, setIsBuyerOpen] = useState(false);
  const words = ["SaaS", "Bots", "Apps", "Tools", "Startups", "APIs", "Products", "Solutions", "Algorithms", "Models", "Agents", "Platforms"];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(prevIndex => (prevIndex + 1) % words.length);
    }, 2500); // 2.5 seconds interval

    return () => clearInterval(interval);
  }, []);
  const handleListProductClick = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (session) {
      navigate("/list-product");
    } else {
      navigate("/auth");
    }
  };
  return <div className="min-h-screen relative overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-accent via-accent2 to-accent3" />}>
        <AnimatedBackground />
      </Suspense>

      <div className="relative container mx-auto px-4 py-24">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="space-y-8">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <HeroTitle currentWordIndex={currentWordIndex} words={words} />
          </Suspense>

          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.3
        }} className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto text-center">
            The eBay of AI SaaS Businesses - A trusted platform for buying and selling cutting-edge AI solutions.
          </motion.p>

          <div className="flex flex-col gap-6 items-center">
            <RainbowButton onClick={handleListProductClick} className="text-lg py-6 px-12">
              List your AI Product Now
            </RainbowButton>
            <Suspense fallback={<Skeleton className="w-full max-w-md h-32" />}>
              <NewsletterSubscription newsletterEmail={newsletterEmail} setNewsletterEmail={setNewsletterEmail} subscriberCount={subscriberCount} setSubscriberCount={setSubscriberCount} />
            </Suspense>
          </div>

          <Suspense fallback={<Skeleton className="h-16" />}>
            <SecurityFeatures />
          </Suspense>

          <div className="mt-24 mb-16">
            <h2 className="font-bold text-white text-center mb-4 exo-2-heading text-3xl">
              AI SaaS Businesses for Sale
            </h2>
            <p className="text-gray-200 max-w-3xl mx-auto text-center text-xl">
              We manually verify, audit & filter AI SaaS products before listing them here. Interested in buying one? Reach out we'll guide you through a smooth, secured purchasing process!
            </p>
          </div>

          <Suspense fallback={<Skeleton className="h-64" />}>
            <HowItWorks />
          </Suspense>

          <Suspense fallback={<Skeleton className="w-full h-48 mt-16" />}>
            <FeatureHighlights />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64" />}>
            <RoleInfo isSellerOpen={isSellerOpen} setIsSellerOpen={setIsSellerOpen} isBuyerOpen={isBuyerOpen} setIsBuyerOpen={setIsBuyerOpen} />
          </Suspense>

          <div className="mt-8 text-sm text-gray-200">
            ✓ Free AI Valuations &nbsp; • &nbsp; ✓ Secure Platform &nbsp; • &nbsp; ✓ Premium Network
          </div>
        </motion.div>
      </div>
    </div>;
};
export default Hero;