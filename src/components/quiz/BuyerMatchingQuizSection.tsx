
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Target, Users, DollarSign, ArrowRight, Sparkles, Bell, CheckCircle, Zap } from "lucide-react";

interface QuizAnswer {
  [key: number]: string | number;
}

interface Question {
  id: number;
  title: string;
  text: string;
  options: {
    value: string | number;
    label: string;
    description?: string;
  }[];
}

interface BuyerMatchingQuizSectionProps {
  isSubmitPage?: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    title: "Investment Budget",
    text: "What's your budget range for acquiring an AI SaaS business?",
    options: [
      { value: "10000", label: "$5K - $25K", description: "Small scale acquisitions" },
      { value: "50000", label: "$25K - $100K", description: "Mid-tier businesses" },
      { value: "250000", label: "$100K - $500K", description: "Established businesses" },
      { value: "750000", label: "$500K - $1M", description: "Large scale acquisitions" },
      { value: "1000000", label: "$1M+", description: "Enterprise level deals" }
    ]
  },
  {
    id: 2,
    title: "AI Technology Focus",
    text: "Which AI technologies are you most interested in?",
    options: [
      { value: "nlp", label: "Natural Language Processing", description: "Chatbots, content generation, language analysis" },
      { value: "computer_vision", label: "Computer Vision", description: "Image recognition, visual analysis" },
      { value: "machine_learning", label: "Machine Learning/Predictive Analytics", description: "Data analysis, forecasting, recommendations" },
      { value: "automation", label: "AI Automation/RPA", description: "Workflow automation, process optimization" },
      { value: "generative_ai", label: "Generative AI", description: "Content creation, creative applications" },
      { value: "any", label: "Open to All AI Technologies", description: "No specific preference" }
    ]
  },
  {
    id: 3,
    title: "Revenue Requirements",
    text: "What monthly recurring revenue (MRR) range are you targeting?",
    options: [
      { value: "0", label: "Pre-revenue/Early Stage", description: "Looking for potential and growth" },
      { value: "5000", label: "$1K - $10K MRR", description: "Early traction businesses" },
      { value: "25000", label: "$10K - $50K MRR", description: "Growing businesses" },
      { value: "100000", label: "$50K - $200K MRR", description: "Established revenue streams" },
      { value: "300000", label: "$200K+ MRR", description: "High-revenue businesses" }
    ]
  },
  {
    id: 4,
    title: "Development Stage",
    text: "What stage of business development interests you most?",
    options: [
      { value: "mvp", label: "MVP/Beta Stage", description: "Early product with initial testing" },
      { value: "early_revenue", label: "Early Revenue", description: "First paying customers, proven concept" },
      { value: "growth", label: "Growth Stage", description: "Scaling with established customer base" },
      { value: "mature", label: "Mature/Profitable", description: "Well-established with strong metrics" },
      { value: "any", label: "Open to All Stages", description: "No specific stage preference" }
    ]
  },
  {
    id: 5,
    title: "Business Model Preference",
    text: "Which business models are you most interested in?",
    options: [
      { value: "saas", label: "SaaS Subscription", description: "Monthly/annual recurring revenue" },
      { value: "marketplace", label: "AI Marketplace/Platform", description: "Transaction-based revenue" },
      { value: "api", label: "API/Usage-Based", description: "Pay-per-use or API calls" },
      { value: "enterprise", label: "Enterprise Licensing", description: "Large contract deals" },
      { value: "freemium", label: "Freemium Model", description: "Free tier with premium upgrades" },
      { value: "any", label: "Open to All Models", description: "No specific preference" }
    ]
  },
  {
    id: 6,
    title: "Industry Focus",
    text: "Are you interested in AI solutions for specific industries?",
    options: [
      { value: "fintech", label: "FinTech/Finance", description: "Financial services and banking" },
      { value: "healthcare", label: "Healthcare/MedTech", description: "Medical and health applications" },
      { value: "ecommerce", label: "E-commerce/Retail", description: "Shopping and retail optimization" },
      { value: "marketing", label: "Marketing/Sales", description: "Marketing automation and sales tools" },
      { value: "productivity", label: "Productivity/Business Tools", description: "Workflow and business optimization" },
      { value: "any", label: "Industry Agnostic", description: "Open to all industries" }
    ]
  },
  {
    id: 7,
    title: "Deal Timeline",
    text: "How quickly are you looking to complete an acquisition?",
    options: [
      { value: "immediate", label: "Immediately", description: "Ready to close within 30 days" },
      { value: "1-3_months", label: "1-3 Months", description: "Active searching, can move quickly" },
      { value: "3-6_months", label: "3-6 Months", description: "Evaluating options, flexible timeline" },
      { value: "6-12_months", label: "6-12 Months", description: "Long-term planning, not urgent" },
      { value: "opportunistic", label: "Opportunistic", description: "Only for the right deal" }
    ]
  },
  {
    id: 8,
    title: "Geographic Preference",
    text: "Do you have any geographic preferences for the business location?",
    options: [
      { value: "north_america", label: "North America", description: "US, Canada, Mexico" },
      { value: "europe", label: "Europe", description: "EU countries, UK" },
      { value: "asia_pacific", label: "Asia Pacific", description: "Asia, Australia, New Zealand" },
      { value: "english_speaking", label: "English-Speaking Countries", description: "Primary language preference" },
      { value: "any", label: "No Geographic Preference", description: "Location doesn't matter" }
    ]
  }
];

export const BuyerMatchingQuizSection = ({ isSubmitPage = false }: BuyerMatchingQuizSectionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [showContactForm, setShowContactForm] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    slackHandle: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load saved data and show results if on submit page
  useEffect(() => {
    if (isSubmitPage) {
      const savedAnswers = localStorage.getItem('buyerQuizAnswers');
      const savedFormData = localStorage.getItem('buyerQuizFormData');
      
      if (savedAnswers && savedFormData) {
        setAnswers(JSON.parse(savedAnswers));
        setFormData(JSON.parse(savedFormData));
        setShowResults(true);
      } else {
        // If no saved data, redirect back to quiz
        navigate('/buyer-matching-quiz');
      }
    }
  }, [isSubmitPage, navigate]);

  const totalQuestions = questions.length;
  const progress = (currentQuestion + 1) / totalQuestions * 100;

  const handleOptionSelect = (value: string | number) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);
    localStorage.setItem('buyerQuizAnswers', JSON.stringify(newAnswers));
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowContactForm(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitForm = async () => {
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Submitting buyer matching preferences");

      // Save form data to localStorage
      localStorage.setItem('buyerQuizFormData', JSON.stringify(formData));

      // Store preferences in database
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If not authenticated, store as lead
        const { error: leadError } = await supabase
          .from('buyer_matching_leads')
          .insert([{
            name: formData.fullName,
            email: formData.email,
            company: formData.companyName,
            slack_handle: formData.slackHandle,
            preferences: answers
          }]);

        if (leadError) {
          console.error("Lead storage error:", leadError);
          throw new Error(`Database error: ${leadError.message}`);
        }
      } else {
        // If authenticated, update investor preferences
        const { error: prefError } = await supabase
          .from('investor_preferences')
          .upsert([{
            user_id: user.id,
            budget_min: getBudgetRange(answers[0] as string).min,
            budget_max: getBudgetRange(answers[0] as string).max,
            ai_categories: [answers[1] as string],
            revenue_requirements: answers[2] as string,
            development_stage: answers[3] as string,
            business_model: answers[4] as string,
            industry_focus: answers[5] as string,
            deal_timeline: answers[6] as string,
            geographic_preferences: answers[7] as string,
            updated_at: new Date().toISOString()
          }]);

        if (prefError) {
          console.error("Preferences error:", prefError);
          throw new Error(`Preferences error: ${prefError.message}`);
        }
      }

      toast({
        title: "Success! You're all set up for AI deal matching",
        description: "We'll notify you on Slack when matching businesses become available."
      });

      // Navigate to submit page to show results
      navigate('/buyer-matching-quiz/submit');
      
    } catch (error: any) {
      console.error('Error saving buyer preferences:', error);
      toast({
        title: "Error",
        description: `There was a problem saving your preferences: ${error.message}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBudgetRange = (budgetValue: string) => {
    switch(budgetValue) {
      case "10000": return { min: 5000, max: 25000 };
      case "50000": return { min: 25000, max: 100000 };
      case "250000": return { min: 100000, max: 500000 };
      case "750000": return { min: 500000, max: 1000000 };
      case "1000000": return { min: 1000000, max: 10000000 };
      default: return { min: 0, max: 1000000 };
    }
  };

  const hasAnswer = answers.hasOwnProperty(currentQuestion);

  // Show contact form after quiz completion
  if (showContactForm && !isSubmitPage) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-6">Complete Your Buyer Profile</h3>
          <p className="text-white/90 text-lg mb-6">We'll use this information to send you perfectly matched AI SaaS opportunities via Slack.</p>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              disabled={isSubmitting}
            />
            <input
              type="email"
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={isSubmitting}
            />
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60"
              placeholder="Company/Investment Firm"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              disabled={isSubmitting}
            />
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60"
              placeholder="Slack Handle (e.g., @john.doe)"
              value={formData.slackHandle}
              onChange={(e) => setFormData(prev => ({ ...prev, slackHandle: e.target.value }))}
              disabled={isSubmitting}
            />
            <Button
              onClick={submitForm}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#D946EE]/90 hover:to-[#8B5CF6]/90 text-white font-semibold py-3"
            >
              {isSubmitting ? 'Setting Up Your Matches...' : 'Start Getting Matched!'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show results after successful form submission or on submit page
  if (showResults || isSubmitPage) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20 backdrop-blur-lg border border-white/20 rounded-xl p-8 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-[#D946EE] mr-3" />
            <h2 className="exo-2-heading text-3xl font-bold text-white">You're All Set for AI Deal Matching!</h2>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <div className="text-xl font-bold text-[#D946EE] mb-2">
              🎯 Smart Matching Activated
            </div>
            <p className="text-white/90 text-lg mb-3">Your preferences have been saved and our AI matching system is now working for you.</p>
            <div className="bg-white/5 rounded-lg p-3 text-sm text-white/80">
              💡 You'll receive instant Slack notifications when AI SaaS businesses matching your criteria become available.
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <Zap className="h-6 w-6 text-[#0EA4E9] mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Instant Alerts</h4>
              <p className="text-white/80 text-sm">Get notified on Slack the moment a matching business is listed</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <Target className="h-6 w-6 text-[#8B5CF6] mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Perfect Matches</h4>
              <p className="text-white/80 text-sm">AI-powered matching based on your exact criteria</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <CheckCircle className="h-6 w-6 text-[#D946EE] mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Pre-Qualified</h4>
              <p className="text-white/80 text-sm">All businesses are verified and ready for acquisition</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">What Happens Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-[#D946EE] rounded-full flex items-center justify-center text-white font-bold mr-3 mt-1">1</div>
                <div>
                  <h4 className="text-white font-medium">Join Our Slack Channel</h4>
                  <p className="text-white/70 text-sm">We'll send you an invite to our exclusive buyer community</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold mr-3 mt-1">2</div>
                <div>
                  <h4 className="text-white font-medium">Receive Matched Deals</h4>
                  <p className="text-white/70 text-sm">Get instant notifications for businesses that fit your criteria</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-[#0EA4E9] rounded-full flex items-center justify-center text-white font-bold mr-3 mt-1">3</div>
                <div>
                  <h4 className="text-white font-medium">Review & Connect</h4>
                  <p className="text-white/70 text-sm">Access detailed business information and connect with sellers</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold mr-3 mt-1">4</div>
                <div>
                  <h4 className="text-white font-medium">Complete Your Acquisition</h4>
                  <p className="text-white/70 text-sm">Use our secure escrow system to finalize the purchase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass p-8 rounded-xl">
          <h3 className="text-2xl font-semibold text-white mb-4">Ready to Browse Available Deals?</h3>
          <p className="text-white/90 mb-6 text-lg">
            While you wait for perfect matches, explore our current marketplace of AI SaaS businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/marketplace')}
              className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#D946EE]/90 hover:to-[#8B5CF6]/90 text-white font-semibold py-3 px-6"
            >
              Browse Marketplace
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 py-3 px-6"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show quiz questions (only if not on submit page)
  if (!isSubmitPage) {
    const currentQuestionData = questions[currentQuestion];
    
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="glass p-6 md:p-8 rounded-xl">
          {/* Progress Bar */}
          <div className="h-2 bg-white/20 rounded-full mb-6">
            <div 
              className="h-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          {/* Question */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold mr-4">
                {currentQuestion + 1}
              </div>
              <h3 className="text-xl font-semibold text-white">{currentQuestionData.title}</h3>
            </div>
            <p className="text-lg text-white/90 mb-6">{currentQuestionData.text}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestionData.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  answers[currentQuestion] === option.value
                    ? 'bg-gradient-to-r from-[#D946EE]/30 to-[#8B5CF6]/30 border-[#D946EE] shadow-lg shadow-[#D946EE]/30'
                    : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/40'
                }`}
                onClick={() => handleOptionSelect(option.value)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-4 relative ${
                    answers[currentQuestion] === option.value ? 'border-[#D946EE] bg-[#D946EE]' : 'border-white/50'
                  }`}>
                    {answers[currentQuestion] === option.value && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-white/70 text-sm mt-1">{option.description}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-white/30 text-white bg-white/15 hover:bg-white/15"
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!hasAnswer}
              className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#D946EE]/90 hover:to-[#8B5CF6]/90 text-white"
            >
              {currentQuestion === totalQuestions - 1 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
