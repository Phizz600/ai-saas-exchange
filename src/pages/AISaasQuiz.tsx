
import { QuizDialog } from "@/components/hero/QuizDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Star, Trophy, LightBulb } from "lucide-react";

export const AISaasQuiz = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#13293D] to-[#18435A]">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="exo-2-heading text-4xl md:text-6xl text-white mb-6 leading-tight">
            What's Your AI SaaS Business Really Worth?
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Get an instant, data-driven valuation based on current market conditions
            and actual AI SaaS sales data.
          </p>
          <Button
            onClick={() => setIsQuizOpen(true)}
            size="xl"
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-semibold"
          >
            Start Free Valuation
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass p-6 text-center">
            <Star className="h-8 w-8 text-[#D946EE] mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">60-Second Quiz</h3>
            <p className="text-white/80">
              Quick, focused questions to accurately assess your AI SaaS value
            </p>
          </div>
          <div className="glass p-6 text-center">
            <Trophy className="h-8 w-8 text-[#8B5CF6] mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Market Data-Driven</h3>
            <p className="text-white/80">
              Valuations based on real AI SaaS marketplace transactions
            </p>
          </div>
          <div className="glass p-6 text-center">
            <LightBulb className="h-8 w-8 text-[#0EA4E9] mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Expert Insights</h3>
            <p className="text-white/80">
              Get actionable recommendations to increase your business value
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <p className="text-white/80 mb-4">Trusted by 1,000+ AI founders</p>
          <div className="flex justify-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
              alt="Person using laptop"
              className="w-64 h-48 object-cover rounded-lg opacity-80"
            />
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475"
              alt="Tech visualization"
              className="w-64 h-48 object-cover rounded-lg opacity-80"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="exo-2-heading text-3xl text-white mb-6">
            Ready to Know Your AI SaaS Value?
          </h2>
          <Button
            onClick={() => setIsQuizOpen(true)}
            size="xl"
            className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white font-semibold"
          >
            Take the Free Quiz Now
          </Button>
        </div>
      </main>

      <QuizDialog open={isQuizOpen} onOpenChange={setIsQuizOpen} />
      <Footer />
    </div>
  );
};

export default AISaasQuiz;
