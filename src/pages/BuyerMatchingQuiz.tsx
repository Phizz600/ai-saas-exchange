
import { Navbar } from "@/components/Navbar";
import { Star, Trophy, Lightbulb } from "lucide-react";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
import { BuyerMatchingQuizSection } from "@/components/quiz/BuyerMatchingQuizSection";
import { useLocation } from "react-router-dom";

export const BuyerMatchingQuiz = () => {
  const location = useLocation();
  const isSubmitPage = location.pathname === '/buyer-matching-quiz/submit';

  return (
    <AnimatedGradientBackground>
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section - only show on main quiz page */}
        {!isSubmitPage && (
          <div className="text-center mb-8 max-w-4xl mx-auto mt-20">
            <div className="space-y-4">
              <h1 className="exo-2-heading text-4xl md:text-5xl text-white leading-tight">Find Your Perfect AI SaaS Match!</h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">🎯 Tell us what you're looking for and we'll notify you instantly when matching AI SaaS businesses become available for purchase.</p>
            </div>
          </div>
        )}

        {/* Quiz Section */}
        <div className={`mb-12 ${isSubmitPage ? 'mt-24' : ''}`}>
          <BuyerMatchingQuizSection isSubmitPage={isSubmitPage} />
        </div>

        {/* Trust Indicators - only show on main quiz page */}
        {!isSubmitPage && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="glass p-4 text-center">
                <Star className="h-6 w-6 text-[#D946EE] mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Smart Matching</h3>
                <p className="text-xs md:text-sm text-white/80">
                  AI-powered algorithm matches you with businesses that fit your exact criteria
                </p>
              </div>
              <div className="glass p-4 text-center">
                <Trophy className="h-6 w-6 text-[#8B5CF6] mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Instant Alerts</h3>
                <p className="text-xs md:text-sm text-white/80">
                  Get notified on Slack the moment a matching AI SaaS business is listed
                </p>
              </div>
              <div className="glass p-4 text-center sm:col-span-2 md:col-span-1">
                <Lightbulb className="h-6 w-6 text-[#0EA4E9] mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Exclusive Access</h3>
                <p className="text-xs md:text-sm text-white/80">
                  Be the first to know about off-market AI deals before they go public
                </p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center mt-6 md:mt-12 mb-12">
              <p className="text-white/80 text-sm md:text-base mb-4">Trusted by 500+ AI investors and acquirers</p>
            </div>
          </>
        )}
      </main>
    </AnimatedGradientBackground>
  );
};

export default BuyerMatchingQuiz;
