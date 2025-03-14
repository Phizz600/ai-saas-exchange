
import { lazy, Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MousePointerClick } from "lucide-react";
import { ProductsShowcase } from "@/components/hero/ProductsShowcase";

const NewsletterSubscription = lazy(() => import("@/components/hero/NewsletterSubscription"));
const FeatureHighlights = lazy(() => import("@/components/hero/FeatureHighlights"));
const AnimatedBackground = lazy(() => import("@/components/hero/AnimatedBackground"));
const HeroTitle = lazy(() => import("@/components/hero/HeroTitle"));
const HowItWorksTitle = lazy(() => import("@/components/hero/HowItWorksTitle"));
const HowItWorksSteps = lazy(() => import("@/components/hero/HowItWorksSteps"));
const SecurityFeatures = lazy(() => import("@/components/hero/SecurityFeatures"));
const RoleInfo = lazy(() => import("@/components/hero/RoleInfo"));
const YouTubeEmbed = lazy(() => import("@/components/hero/YouTubeEmbed"));

const Hero = () => {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(342);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isBuyerOpen, setIsBuyerOpen] = useState(false);
  const words = ["SaaS", "Bots", "Apps", "Tools", "Startups", "APIs", "Products", "Solutions", "Algorithms", "Models", "Agents", "Platforms"];
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(prevIndex => (prevIndex + 1) % words.length);
    }, 2500);
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

  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
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
          }} className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto text-center">Join an exclusive network of investors gaining early access to cutting-edge AI SaaS businesses, products, tools, and solutions through our innovative Dutch auction marketplace.</motion.p>

          <div className="flex flex-col gap-6 items-center">
            <Button variant="green" onClick={handleListProductClick} className="py-6 px-12 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <MousePointerClick className="mr-2" />
              Sell your AI SaaS Business
            </Button>
            
            <Suspense fallback={<Skeleton className="w-full max-w-md h-32" />}>
              <NewsletterSubscription newsletterEmail={newsletterEmail} setNewsletterEmail={setNewsletterEmail} subscriberCount={subscriberCount} setSubscriberCount={setSubscriberCount} />
            </Suspense>
          </div>

          <Suspense fallback={<Skeleton className="h-16" />}>
            <SecurityFeatures />
          </Suspense>

          <div className="mt-24 mb-16">
            <h2 className="font-bold text-white text-center mb-4 exo-2-heading text-2xl">
              AI SaaS Businesses for Sale
            </h2>
            <p className="text-gray-200 max-w-3xl mx-auto text-center text-xl mb-12">
              We manually verify, audit & filter AI SaaS products before listing them here. Interested in buying one? Reach out we'll guide you through a smooth, secured purchasing process!
            </p>

            <ProductsShowcase 
              isAuthenticated={isAuthenticated} 
              handleAuthRedirect={handleAuthRedirect} 
            />
          </div>

          <Suspense fallback={<Skeleton className="h-16" />}>
            <HowItWorksTitle />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64 w-full max-w-4xl mx-auto" />}>
            <YouTubeEmbed videoId="GyK9U07rykE" title="How AI Exchange Works - Video Tutorial" />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64" />}>
            <HowItWorksSteps />
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
    </div>
  );
};

export default Hero;
