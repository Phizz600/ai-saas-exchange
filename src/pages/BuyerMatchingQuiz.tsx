
import { Navbar } from "@/components/Navbar";
import { Star, Trophy, Lightbulb } from "lucide-react";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";

export const BuyerMatchingQuiz = () => {
  return (
    <AnimatedGradientBackground>
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 max-w-4xl mx-auto mt-20">
          <div className="space-y-4">
            <h1 className="exo-2-heading text-4xl md:text-5xl text-white leading-tight">Find Your Perfect AI Business!</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">🎯 Get Matched with AI SaaS Businesses That Meet Your Investment Criteria - We'll Notify You When Perfect Opportunities Arise.</p>
          </div>
        </div>

        {/* Quiz Section Placeholder */}
        <div className="mb-12">
          <div className="glass max-w-2xl mx-auto p-8 rounded-xl">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
              <p className="text-white/80">
                Our buyer matching quiz is currently under development. Soon you'll be able to specify your investment preferences and get matched with perfect AI SaaS opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="glass p-4 text-center">
            <Star className="h-6 w-6 text-[#D946EE] mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Smart Matching</h3>
            <p className="text-xs md:text-sm text-white/80">
              AI-powered algorithm matches you with businesses that fit your criteria
            </p>
          </div>
          <div className="glass p-4 text-center">
            <Trophy className="h-6 w-6 text-[#8B5CF6] mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Exclusive Deals</h3>
            <p className="text-xs md:text-sm text-white/80">
              Get first access to off-market AI SaaS opportunities
            </p>
          </div>
          <div className="glass p-4 text-center sm:col-span-2 md:col-span-1">
            <Lightbulb className="h-6 w-6 text-[#0EA4E9] mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Real-Time Alerts</h3>
            <p className="text-xs md:text-sm text-white/80">
              Instant notifications when businesses match your preferences
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-6 md:mt-12 mb-12">
          <p className="text-white/80 text-sm md:text-base mb-4">Join 1,000+ AI investors finding their next acquisition</p>
        </div>
      </main>
    </AnimatedGradientBackground>
  );
};

export default BuyerMatchingQuiz;
