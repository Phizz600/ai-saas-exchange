import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Rocket, LineChart, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { InvestorQuestionnaire } from "@/components/investor/InvestorQuestionnaire";
import { supabase } from "@/integrations/supabase/client";
export const ComingSoon = () => {
  const [progress] = useState(80); // 800 out of 1000 spots taken
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);

  // Check if user has completed questionnaire on mount
  useEffect(() => {
    const checkQuestionnaireStatus = async () => {
      try {
        // Check if user is authenticated
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (user) {
          // Check if user has preferences saved and if they've completed all questions
          const {
            data: preferences
          } = await supabase.from('investor_preferences').select('current_question').eq('user_id', user.id).maybeSingle();
          if (preferences?.current_question >= 9) {
            // 9 is the number of questions
            setQuestionnaireCompleted(true);
          }
        } else {
          // Check local storage for completed preferences
          const storedPreferences = JSON.parse(localStorage.getItem('investor_preferences') || '{}');
          if (storedPreferences.current_question >= 9) {
            setQuestionnaireCompleted(true);
          }
        }
      } catch (error) {
        console.error("Error checking questionnaire status:", error);
      }
    };
    checkQuestionnaireStatus();
  }, []);
  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    setQuestionnaireCompleted(true);
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9]">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 bg-white/90 rounded-xl shadow-xl p-4 sm:p-6 md:p-8 backdrop-blur-sm">
          <Link to="/">
            <img src="/lovable-uploads/f74b20e6-6798-4aeb-badd-2da6c2dce40b.png" alt="AI Exchange Logo" className="h-16 sm:h-20 md:h-24 w-auto mx-auto mb-6 sm:mb-8 object-contain animate-float cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>

          <div className="text-center space-y-4 sm:space-y-6">
            
            
          </div>

          {/* Investor Questionnaire Section */}
          <div className="max-w-xl mx-auto py-6 sm:py-8 space-y-4 sm:space-y-6 border-t border-b border-purple-100">
            {!questionnaireCompleted ? <>
                <div className="text-center">
                  <h2 className="font-bold exo-2-heading bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent leading-tight sm:text-2xl text-4xl">Get Matched with AI SaaS Businesses</h2>
                  <p className="text-sm sm:text-base text-gray-700 mt-2 px-2 sm:px-4">Complete this quick questionnaire to be matched with AI products that fit your investment criteria best.</p>
                </div>
                
                {showQuestionnaire ? <InvestorQuestionnaire variant="comingSoon" showNewsletterButton={true} onComplete={handleQuestionnaireComplete} /> : <Button onClick={() => setShowQuestionnaire(true)} className="w-full max-w-md mx-auto block bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] hover:opacity-90 text-white py-2 px-4 h-auto">
                    Start Investment Matching Quiz
                  </Button>}
              </> : <div className="flex flex-col items-center space-y-4">
                <h3 className="text-2xl font-semibold mb-2 exo-2-heading">Thank you for completing your investor profile!</h3>
                <p className="text-gray-600 mb-6">Get weekly AI product matches tailored to your investment preferences, delivered straight to your inbox—so you never miss a perfect opportunity.</p>
                
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="text-center space-y-4">
                    <div className="space-y-6">
                      <div className="flex items-center justify-center gap-3">
                        <Users className="w-6 h-6 text-[#8B5CF6]" />
                        <h3 className="text-xl font-semibold text-gray-800">Join 1,000+ AI Investors</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2 bg-purple-100" />
                        <p className="text-[#D946EF] font-semibold">
                          Only 200 spots left! <span className="text-gray-700">Be part of the first wave of AI innovators.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <a href="https://aiexchangeclub.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90 text-white">
                        Join The AI Exchange Club Newsletter
                      </Button>
                    </a>
                  </div>

                  <div className="text-sm text-gray-600">
                    ✓ Premium deal flow &nbsp; • &nbsp; 
                    ✓ Market insights &nbsp; • &nbsp; 
                    ✓ Community access
                  </div>
                </div>
              </div>}
          </div>

          {/* Benefits Section - Moved after Questionnaire */}
          <div className="max-w-xl mx-auto space-y-4 sm:space-y-6">
            <div className="space-y-3 bg-purple-50 p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 text-center text-base sm:text-lg">Why Join as an Investor?</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-700 text-left text-sm sm:text-base">
                
                <li className="flex items-start gap-2">
                  <span className="text-[#8B5CF6] font-bold mt-0.5">→</span>
                  <span>Exclusive deals and preferential pricing through auctions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8B5CF6] font-bold mt-0.5">→</span>
                  <span>Connect with fellow AI investors and industry leaders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8B5CF6] font-bold mt-0.5">→</span>
                  <span>Weekly curated insights on emerging AI opportunities</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-8 sm:my-12">
            <div className="bg-white/50 p-4 sm:p-6 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-[#8B5CF6]" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Premium Deals</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600">Get exclusive first access to vetted AI companies and products before they hit the public market.</p>
            </div>

            <div className="bg-white/50 p-4 sm:p-6 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <LineChart className="w-6 h-6 sm:w-8 sm:h-8 text-[#D946EF]" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Market Advantage</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600">Leverage our Dutch auction system to acquire valuable AI assets at optimal prices.</p>
            </div>

            <div className="bg-white/50 p-4 sm:p-6 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#0EA5E9]" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Elite Network</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600">Connect with fellow AI investors and founders in our exclusive community.</p>
            </div>

            <div className="bg-white/50 p-4 sm:p-6 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Early Mover</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600">Be among the first to capitalize on emerging AI opportunities and trends.</p>
            </div>
          </div>

          <div className="text-center text-gray-500 text-xs sm:text-sm">
            Already have an AI product to list?{" "}
            <Link to="/list-product" className="text-[#8B5CF6] hover:underline">
              List Your AI Product & Get Early Access to Investors
            </Link>
          </div>
        </div>
      </div>
    </div>;
};