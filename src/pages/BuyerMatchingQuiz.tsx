import { Navbar } from "@/components/Navbar";
import { Slack, Trophy, Bell } from "lucide-react";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
import { BuyerMatchingQuestionnaire } from "@/components/buyer/BuyerMatchingQuestionnaire";
export const BuyerMatchingQuiz = () => {
  return <AnimatedGradientBackground>
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 max-w-4xl mx-auto mt-20">
          <div className="space-y-4">
            <h1 className="exo-2-heading text-4xl md:text-5xl text-white leading-tight">Get Matched with AI SaaS Businesses</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">🎯 Match with AI SaaS Businesses That Meet Your Investment Criteria - Receive Your Matches Delivered Directly in the AI Exchange Club Private Slack Community.</p>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="mb-12">
          <BuyerMatchingQuestionnaire variant="comingSoon" className="max-w-2xl mx-auto" />
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="glass p-4 text-center">
            <Trophy className="h-6 w-6 text-[#D946EE] mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm md:text-base">AI-Powered Matching</h3>
            <p className="text-xs md:text-sm text-white/80">
              Advanced algorithm finds businesses that perfectly fit your investment criteria
            </p>
          </div>
          <div className="glass p-4 text-center">
            <Slack className="h-6 w-6 text-[#8B5CF6] mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Private Slack Access</h3>
            <p className="text-xs md:text-sm text-white/80">
              Exclusive buyer community with direct access to off-market opportunities
            </p>
          </div>
          <div className="glass p-4 text-center sm:col-span-2 md:col-span-1">
            <Bell className="h-6 w-6 text-[#0EA4E9] mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Slack Notifications</h3>
            <p className="text-xs md:text-sm text-white/80">Real-time deal alerts delivered to your private #buyer-matches channel</p>
          </div>
        </div>

        {/* Slack Community Benefits */}
        <div className="max-w-4xl mx-auto mt-12 mb-8">
          <div className="glass p-6 md:p-8">
            <div className="text-center mb-6">
              <Slack className="h-12 w-12 text-[#8B5CF6] mx-auto mb-4" />
              <h2 className="exo-2-heading text-2xl md:text-3xl text-white mb-2">Exclusive Slack Community Benefits</h2>
              <p className="text-white/80">Join our private buyer network for seamless deal matching</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#D946EE] rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-white font-semibold">Direct #buyer-matches Channel</h4>
                    <p className="text-white/80 text-sm">Receive personalized AI business opportunities tailored to your criteria</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-white font-semibold">Instant Slack Notifications</h4>
                    <p className="text-white/80 text-sm">Get notified immediately when new listings match your investment profile</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#0EA4E9] rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-white font-semibold">Private Buyer Community</h4>
                    <p className="text-white/80 text-sm">Network with 500+ serious AI business buyers in an exclusive environment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#D946EE] rounded-full mt-2"></div>
                  <div>
                    <h4 className="text-white font-semibold">Direct Seller Communication</h4>
                    <p className="text-white/80 text-sm">Connect with sellers through structured channels for qualified opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-6 md:mt-12 mb-12">
          <p className="text-white/80 text-sm md:text-base mb-4">Join 500+ active buyers in our exclusive Slack community</p>
        </div>
      </main>
    </AnimatedGradientBackground>;
};
export default BuyerMatchingQuiz;