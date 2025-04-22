
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MousePointerClick } from "lucide-react";
import { ProductsShowcase } from "@/components/hero/ProductsShowcase";

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
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative container mx-auto px-4 py-24">
        <div className="space-y-8 animate-fade-in">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <HeroTitle currentWordIndex={currentWordIndex} words={words} />
          </Suspense>

          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto text-center animate-fade-in-delayed">
            Join an exclusive network of investors gaining early access to cutting-edge AI SaaS businesses, products, tools, and solutions through our innovative Dutch auction marketplace.
          </p>

          {/* Button Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              variant="green" 
              onClick={handleListProductClick} 
              className="py-6 px-12 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <MousePointerClick className="mr-2" />
              Sell your AI SaaS Business
            </Button>
            <a href="https://calendly.com/your-founder-link" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button 
                variant="purple" 
                className="py-6 px-12 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
                type="button"
              >
                Schedule a Demo 
              </Button>
            </a>
          </div>
          
          <Suspense fallback={<Skeleton className="w-full max-w-md h-32" />}>
            <NewsletterSubscription 
              newsletterEmail={newsletterEmail} 
              setNewsletterEmail={setNewsletterEmail} 
              subscriberCount={subscriberCount} 
              setSubscriberCount={setSubscriberCount} 
            />
          </Suspense>
          
          <Suspense fallback={<Skeleton className="h-16" />}>
            <SecurityFeatures />
          </Suspense>

          <div className="mt-24 mb-16">
            <h2 className="font-bold text-white text-center mb-4 exo-2-heading text-2xl">
              AI SaaS Businesses for Sale
            </h2>
            <p className="text-gray-200 max-w-3xl mx-auto text-center text-xl mb-12">
              We manually verify, audit &amp; filter AI SaaS businesses before listing them. Interested in buying one? Our Dutch Auction marketplace guides you through a smooth, secured purchasing process!
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
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .animate-fade-in-delayed {
            animation: fadeIn 0.5s ease-out 0.3s forwards;
            opacity: 0;
          }
        `}
      </style>
    </div>
  );
};

export default HeroSection;
