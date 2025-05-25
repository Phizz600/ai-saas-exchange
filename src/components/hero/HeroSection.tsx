import { lazy, Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MousePointerClick, ShoppingCart } from "lucide-react";
import { ProductsShowcase } from "@/components/hero/ProductsShowcase";
import { useNavigate } from "react-router-dom";

// Keep lazy loading for these components
const NewsletterSubscription = lazy(() => import("@/components/hero/NewsletterSubscription"));
const FeatureHighlights = lazy(() => import("@/components/hero/FeatureHighlights"));
const HeroTitle = lazy(() => import("@/components/hero/HeroTitle"));
const HowItWorksTitle = lazy(() => import("@/components/hero/HowItWorksTitle"));
const HowItWorksSteps = lazy(() => import("@/components/hero/HowItWorksSteps"));
const SecurityFeatures = lazy(() => import("@/components/hero/SecurityFeatures"));
const RoleInfo = lazy(() => import("@/components/hero/RoleInfo"));
const YouTubeEmbed = lazy(() => import("@/components/hero/YouTubeEmbed"));
interface HeroSectionProps {
  isAuthenticated: boolean;
  currentWordIndex: number;
  words: string[];
  newsletterEmail: string;
  setNewsletterEmail: (email: string) => void;
  subscriberCount: number;
  setSubscriberCount: React.Dispatch<React.SetStateAction<number>>;
  isSellerOpen: boolean;
  setIsSellerOpen: (open: boolean) => void;
  isBuyerOpen: boolean;
  setIsBuyerOpen: (open: boolean) => void;
  handleListProductClick: () => void;
  handleAuthRedirect: () => void;
}
const HeroSection = ({
  isAuthenticated,
  currentWordIndex,
  words,
  newsletterEmail,
  setNewsletterEmail,
  subscriberCount,
  setSubscriberCount,
  isSellerOpen,
  setIsSellerOpen,
  isBuyerOpen,
  setIsBuyerOpen,
  handleListProductClick,
  handleAuthRedirect
}: HeroSectionProps) => {
  const navigate = useNavigate();
  const handleQuizClick = () => {
    window.scrollTo(0, 0); // Scroll to top before navigation
    navigate('/ai-saas-quiz');
  };

  // Removed the handleBuyAIBusinessClick function since it's no longer needed

  return <div className="min-h-screen relative overflow-hidden">
      
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
        }} className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto text-center">Join an exclusive network of investors gaining early access to AI SaaS businesses, products, tools, and solutions through our secure Dutch auction marketplace.</motion.p>

          {/* Button Row - Updated with rearranged buttons */}
          <div className="flex flex-col items-center gap-4 justify-center">
            <Button variant="purple" className="w-full max-w-xs py-6 px-12 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" onClick={handleQuizClick}>
              Get your Free AI SaaS Valuation
            </Button>
            <Button variant="green" onClick={() => window.open('https://airtable.com/appqbmIOXXLNFhZyj/pagutIK7nf0unyJm3/form', '_blank')} className="w-full max-w-xs py-6 px-12 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <MousePointerClick className="mr-2" />
              Sell your AI SaaS Business
            </Button>
<<<<<<< HEAD
            <Button className="w-full max-w-xs py-6 px-12 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#08A4E9]/30 transition-all duration-300 transform hover:-translate-y-1 bg-[#08A4E9] hover:bg-[#0794d3]" onClick={() => window.open('https://aiexchangeclub.carrd.co/', '_blank')}>
=======
            <Button 
              className="w-full max-w-xs py-6 px-12 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-1 bg-red-500 hover:bg-red-600"
              onClick={() => window.open('https://aiexchangeclub.carrd.co/', '_blank')}
            >
>>>>>>> b7b8c81 (test - I changed the color of the 'Buy a SaaS'. Few other changes in regards to the quizpage)
              <ShoppingCart className="mr-2" />
              Buy an AI SaaS Business
            </Button>
          </div>
          
          {/* ProductHunt Badge */}
          <div className="flex justify-center mt-6 mb-6">
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.6,
            delay: 0.5
          }}>
              <a href="https://www.producthunt.com/posts/ai-exchange-club?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-ai&#0045;exchange&#0045;club" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity block">
                
              </a>
            </motion.div>
          </div>
          
          <Suspense fallback={<Skeleton className="w-full max-w-md h-32" />}>
            <NewsletterSubscription newsletterEmail={newsletterEmail} setNewsletterEmail={setNewsletterEmail} subscriberCount={subscriberCount} setSubscriberCount={setSubscriberCount} />
          </Suspense>
          
          <Suspense fallback={<Skeleton className="h-16" />}>
            <SecurityFeatures />
          </Suspense>

          <div className="mt-24 mb-16">
            <h2 className="font-bold text-white text-center mb-4 exo-2-heading text-2xl">
              AI SaaS Businesses for Sale
            </h2>
            <p className="text-gray-200 max-w-3xl mx-auto text-center text-xl mb-12">
              We manually verify, audit & filter AI SaaS businesses before listing them. Interested in buying one? Our AI powered marketplace guides you through a smooth, secured purchasing process!
            </p>

            <ProductsShowcase isAuthenticated={isAuthenticated} handleAuthRedirect={handleAuthRedirect} />
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
export default HeroSection;