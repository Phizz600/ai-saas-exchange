import { Navbar } from "@/components/Navbar";
import { Star, Trophy, Lightbulb } from "lucide-react";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
import { AISaasQuizSection } from "@/components/quiz/AISaasQuizSection";
export const AISaasQuiz = () => {
  return <AnimatedGradientBackground>
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 max-w-4xl mx-auto mt-20">
          
          <div className="space-y-4">
            <h1 className="exo-2-heading text-4xl md:text-5xl text-white leading-tight">
              AI SaaS Business Valuation
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Discover your AI SaaS business worth with our intelligent 60-second assessment
            </p>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="mb-12">
          <AISaasQuizSection />
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="glass p-4 text-center">
            <Star className="h-6 w-6 text-[#D946EE] mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm md:text-base">60-Second Quiz</h3>
            <p className="text-xs md:text-sm text-white/80">
              Quick, focused questions to accurately assess your AI SaaS value
            </p>
          </div>
          <div className="glass p-4 text-center">
            <Trophy className="h-6 w-6 text-[#8B5CF6] mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Market Data-Driven</h3>
            <p className="text-xs md:text-sm text-white/80">
              Valuations based on real AI SaaS marketplace transactions
            </p>
          </div>
          <div className="glass p-4 text-center sm:col-span-2 md:col-span-1">
            <Lightbulb className="h-6 w-6 text-[#0EA4E9] mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Expert Insights</h3>
            <p className="text-xs md:text-sm text-white/80">
              Get actionable recommendations to increase your business value
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-6 md:mt-12 mb-12">
          <p className="text-white/80 text-sm md:text-base mb-4">Trusted by 1,000+ AI founders</p>
        </div>
      </main>
    </AnimatedGradientBackground>;
};
export default AISaasQuiz;