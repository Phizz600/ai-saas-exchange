import { lazy, Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, TrendingDown, Users, Star, History, MousePointerClick } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const NewsletterSubscription = lazy(() => import("@/components/hero/NewsletterSubscription"));
const FeatureHighlights = lazy(() => import("@/components/hero/FeatureHighlights"));
const AnimatedBackground = lazy(() => import("@/components/hero/AnimatedBackground"));
const HeroTitle = lazy(() => import("@/components/hero/HeroTitle"));
const HowItWorksTitle = lazy(() => import("@/components/hero/HowItWorksTitle"));
const HowItWorksSteps = lazy(() => import("@/components/hero/HowItWorksSteps"));
const SecurityFeatures = lazy(() => import("@/components/hero/SecurityFeatures"));
const RoleInfo = lazy(() => import("@/components/hero/RoleInfo"));
const YouTubeEmbed = lazy(() => import("@/components/hero/YouTubeEmbed"));

const placeholderProducts = [{
  id: 1,
  title: "AI Content Generator Pro",
  description: "Generate high-quality content with advanced AI",
  price: 49999,
  category: "Content Generation",
  stage: "Revenue",
  monthlyRevenue: 8500,
  monthlyTraffic: 15000,
  grossProfitMargin: 75,
  monthlyChurnRate: 2.5,
  image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
}, {
  id: 2,
  title: "SmartBot Assistant",
  description: "24/7 customer service automation platform",
  isAuction: true,
  currentPrice: 75000,
  minPrice: 45000,
  timeLeft: "2d 4h",
  category: "Customer Service",
  stage: "Scale",
  monthlyTraffic: 25000,
  grossProfitMargin: 82,
  monthlyChurnRate: 1.8,
  image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
}, {
  id: 3,
  title: "Neural Art Studio",
  description: "Transform ideas into artwork instantly",
  price: 35000,
  category: "Image Generation",
  stage: "Growth",
  monthlyRevenue: 5200,
  monthlyTraffic: 8000,
  image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
}, {
  id: 4,
  title: "DevAI Companion",
  description: "AI-powered code completion and review",
  isAuction: true,
  currentPrice: 89000,
  minPrice: 65000,
  timeLeft: "3d 12h",
  category: "Development",
  stage: "Mature",
  monthlyTraffic: 45000,
  image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
}, {
  id: 5,
  title: "VoiceGenius AI",
  description: "Advanced voice synthesis and processing",
  price: 42000,
  category: "Audio Processing",
  stage: "Revenue",
  monthlyRevenue: 6800,
  monthlyTraffic: 12000,
  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
}, {
  id: 6,
  title: "FinanceGPT Pro",
  description: "AI-powered financial analysis and forecasting",
  isAuction: true,
  currentPrice: 95000,
  minPrice: 70000,
  timeLeft: "1d 8h",
  category: "Finance",
  stage: "Scale",
  monthlyTraffic: 30000,
  image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
}];

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
            Join an exclusive network of investors gaining early access to cutting-edge AI products, tools, and companies through our innovative auction marketplace.
          </motion.p>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {placeholderProducts.map(product => <motion.div key={product.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3
            }} className="h-full">
                  <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-gray-100/20">
                    <div className="relative h-48">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      {product.isAuction && <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                            <TrendingDown className="w-4 h-4 mr-1" />
                            Dutch Auction
                          </Badge>
                        </div>}
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-exo text-xl font-semibold text-gray-900 mb-2">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {product.category}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {product.stage}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-semibold text-green-600">
                            {product.isAuction ? formatCurrency(product.currentPrice || 0) : formatCurrency(product.price || 0)}
                          </span>
                          {product.isAuction && product.minPrice && <span className="text-sm text-gray-500">
                              (Min: {formatCurrency(product.minPrice)})
                            </span>}
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{product.monthlyTraffic?.toLocaleString()} monthly visitors</span>
                        </div>

                        {product.monthlyRevenue && <div className="text-sm text-gray-600">
                            MRR: {formatCurrency(product.monthlyRevenue)}
                          </div>}
                        
                        {product.grossProfitMargin && <div className="flex items-center gap-2 text-gray-600">
                            <Star className="w-4 h-4" />
                            <span>{product.grossProfitMargin}% profit margin</span>
                          </div>}

                        {typeof product.monthlyChurnRate === 'number' && <div className="flex items-center gap-2 text-gray-600">
                            <History className="w-4 h-4" />
                            <span>{product.monthlyChurnRate}% monthly churn</span>
                          </div>}
                      </div>

                      <div className="pt-4 space-y-2">
                        {product.isAuction ? <Button className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] opacity-75 text-white cursor-not-allowed" disabled>
                            Place Bid
                          </Button> : <Button className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] opacity-75 text-white cursor-not-allowed" disabled>
                            Buy Now
                          </Button>}
                        
                        <Button variant="outline" className="w-full border-2 opacity-75 cursor-not-allowed" disabled>
                          Make an Offer
                        </Button>

                        <Button variant="ghost" className="w-full opacity-75 cursor-not-allowed" disabled>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>)}
            </div>
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
    </div>;
};

export default Hero;
