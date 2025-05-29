import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, DollarSign, Target, ArrowRight, Sparkles } from "lucide-react";

interface QuizAnswer {
  [key: number]: number;
}

interface Question {
  id: number;
  title: string;
  text: string;
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    title: "Business Development Stage",
    text: "What stage is your AI SaaS business currently in?",
    options: [
      { value: 1, label: "Idea/Concept Stage", description: "Still developing the core AI technology" },
      { value: 2, label: "MVP/Beta", description: "Working prototype with initial testing" },
      { value: 3, label: "Early Revenue", description: "Launched with first paying customers" },
      { value: 4, label: "Growth Stage", description: "Established product with growing customer base" },
      { value: 5, label: "Mature/Scale", description: "Well-established with significant market presence" }
    ]
  },
  {
    id: 2,
    title: "Monthly Recurring Revenue",
    text: "What is your current Monthly Recurring Revenue (MRR)?",
    options: [
      { value: 0, label: "Pre-revenue / $0" },
      { value: 1000, label: "$1 - $1,000" },
      { value: 5000, label: "$1,001 - $10,000" },
      { value: 25000, label: "$10,001 - $50,000" },
      { value: 100000, label: "$50,001 - $200,000" },
      { value: 500000, label: "$200,000+" }
    ]
  },
  {
    id: 3,
    title: "Customer Base",
    text: "How many paying customers do you currently have?",
    options: [
      { value: 0, label: "0 customers" },
      { value: 10, label: "1-25 customers" },
      { value: 75, label: "26-150 customers" },
      { value: 400, label: "151-750 customers" },
      { value: 1500, label: "751-3,000 customers" },
      { value: 5000, label: "3,000+ customers" }
    ]
  },
  {
    id: 4,
    title: "AI Technology Focus",
    text: "What type of AI technology powers your SaaS?",
    options: [
      { value: 3, label: "Machine Learning/Predictive Analytics", description: "Data analysis, forecasting, recommendations" },
      { value: 4, label: "Natural Language Processing", description: "Text analysis, chatbots, language understanding" },
      { value: 5, label: "Computer Vision", description: "Image recognition, visual analysis" },
      { value: 4, label: "Process Automation/RPA", description: "Workflow automation, intelligent processing" },
      { value: 5, label: "Generative AI", description: "Content generation, creative AI applications" },
      { value: 2, label: "Other/Multiple Technologies", description: "Combination or specialized AI tech" }
    ]
  },
  {
    id: 5,
    title: "Growth Trajectory",
    text: "What's your monthly growth rate over the past 6 months?",
    options: [
      { value: 1, label: "Declining or no growth" },
      { value: 2, label: "0-5% monthly growth" },
      { value: 3, label: "5-15% monthly growth" },
      { value: 4, label: "15-30% monthly growth" },
      { value: 5, label: "30%+ monthly growth" }
    ]
  },
  {
    id: 6,
    title: "Market Position",
    text: "How would you describe your competitive position?",
    options: [
      { value: 2, label: "Many Competitors", description: "Crowded market with similar solutions" },
      { value: 3, label: "Some Competition", description: "Moderate competition with differentiation" },
      { value: 4, label: "Limited Competition", description: "Few direct competitors in your niche" },
      { value: 5, label: "Market Leader/Unique", description: "First mover or unique AI approach" }
    ]
  },
  {
    id: 7,
    title: "Team & Intellectual Property",
    text: "What's the strength of your technical team and IP?",
    options: [
      { value: 2, label: "Solo founder or small team", description: "Limited technical expertise" },
      { value: 3, label: "Small experienced team", description: "Good AI/tech background" },
      { value: 4, label: "Strong technical team", description: "Deep AI expertise, some IP protection" },
      { value: 5, label: "World-class team", description: "Top AI talent, patents, proprietary algorithms" }
    ]
  },
  {
    id: 8,
    title: "Funding Status",
    text: "What's your current funding situation?",
    options: [
      { value: 1, label: "Bootstrapped / Self-funded" },
      { value: 2, label: "Friends & Family / Angel ($0-$100K)" },
      { value: 3, label: "Seed Round ($100K-$2M)" },
      { value: 4, label: "Series A ($2M-$15M)" },
      { value: 5, label: "Series B+ ($15M+)" }
    ]
  }
];

export const AISaasQuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [showContactForm, setShowContactForm] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [valuation, setValuation] = useState({ low: 0, high: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleOptionSelect = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate valuation but don't show results yet
      calculateValuation();
      // Show contact form instead
      setShowContactForm(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateValuation = () => {
    const stage = answers[0] || 1;
    const mrr = answers[1] || 0;
    const customers = answers[2] || 0;
    const techType = answers[3] || 2;
    const growth = answers[4] || 1;
    const market = answers[5] || 2;
    const team = answers[6] || 2;
    const funding = answers[7] || 1;

    let calculatedValuation = 0;

    if (stage === 1) {
      if (mrr === 0 && customers === 0) {
        calculatedValuation = (team + market + techType - 6) * 50;
        calculatedValuation = Math.max(calculatedValuation, 0);
        calculatedValuation = Math.min(calculatedValuation, 500);
      } else if (mrr === 0) {
        calculatedValuation = 100 + (customers * 0.1) + (team + market) * 200;
        calculatedValuation = Math.min(calculatedValuation, 2000);
      } else {
        calculatedValuation = (mrr * 12) * (1 + growth * 0.2);
      }
    } else if (stage === 2) {
      if (mrr === 0) {
        calculatedValuation = 500 + (customers * 2) + (team + market + techType) * 300;
        calculatedValuation = Math.min(calculatedValuation, 5000);
      } else {
        let multiplier = 2 + (growth * 0.4) + (market * 0.2) + (team * 0.2);
        calculatedValuation = (mrr * 12) * multiplier;
      }
    } else if (stage === 3) {
      let multiplier = 3 + (growth * 0.6) + (market * 0.3) + (team * 0.3);
      calculatedValuation = Math.max((mrr * 12) * multiplier, 5000);
    } else if (stage === 4) {
      let multiplier = 5 + (growth * 1.0) + (market * 0.5) + (team * 0.5);
      calculatedValuation = Math.max((mrr * 12) * multiplier, 50000);
    } else {
      let multiplier = 8 + (growth * 1.2) + (market * 0.6) + (team * 0.8);
      calculatedValuation = Math.max((mrr * 12) * multiplier, 200000);
    }

    if (funding >= 3) {
      calculatedValuation *= 1.1;
    } else if (funding >= 4) {
      calculatedValuation *= 1.3;
    }

    if (stage === 1 && mrr === 0 && customers === 0) {
      calculatedValuation = Math.max(calculatedValuation, 0);
      calculatedValuation = Math.min(calculatedValuation, 500);
    }

    if (calculatedValuation <= 0) {
      calculatedValuation = 50;
    }

    const lowEnd = Math.max(Math.round(calculatedValuation * 0.8), 0);
    const highEnd = Math.round(calculatedValuation * 1.2);
    
    setValuation({ low: lowEnd, high: highEnd });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return '$' + (num / 1000).toFixed(0) + 'K';
    } else {
      return '$' + num.toLocaleString();
    }
  };

  const submitForm = async () => {
    if (!formData.fullName || !formData.email || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to receive your valuation.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Store customer information and quiz answers in valuation_leads table
      const { error } = await supabase
        .from('valuation_leads')
        .insert([
          {
            name: formData.fullName,
            email: formData.email,
            company: formData.companyName,
            quiz_answers: answers // Store all quiz answers
          }
        ]);

      if (error) {
        throw error;
      }

      // Show success message and results
      toast({
        title: "Success!",
        description: "Your information has been saved. Here's your valuation!"
      });

      // Now show the results
      setShowContactForm(false);
      setShowResults(true);

    } catch (error) {
      console.error('Error saving customer information:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnswer = answers.hasOwnProperty(currentQuestion);

  // Show contact form after quiz completion
  if (showContactForm) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-6">Get Your AI SaaS Valuation</h3>
          <p className="text-white/90 text-lg mb-6">
            You're just one step away from discovering your AI SaaS business value!
          </p>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              disabled={isSubmitting}
            />
            <input
              type="email"
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={isSubmitting}
            />
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60"
              placeholder="AI SaaS Business/Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              disabled={isSubmitting}
            />
            <Button
              onClick={submitForm}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#D946EE]/90 hover:to-[#8B5CF6]/90 text-white font-semibold py-3"
            >
              {isSubmitting ? 'Processing...' : 'Get My Valuation'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show results after successful form submission
  if (showResults) {
    const stage = answers[0] || 1;
    const mrr = answers[1] || 0;
    const customers = answers[2] || 0;
    
    let description = '';
    let insights = [];
    let recommendations = [];
    
    if (stage <= 2) {
      description = 'Your AI SaaS is in early stages with significant growth potential.';
      insights = [
        'Your business is in the foundational phase with room for strategic development',
        'Early-stage AI SaaS companies often see exponential growth with proper execution',
        'Focus on product-market fit and initial customer validation'
      ];
      recommendations = [
        'Prioritize customer feedback to refine your AI capabilities',
        'Develop a clear go-to-market strategy for your AI solution',
        'Consider building strategic partnerships to accelerate growth',
        'Focus on improving user onboarding and retention metrics'
      ];
    } else if (stage <= 3) {
      description = 'Your business shows strong early traction with proven market demand.';
      insights = [
        'You have demonstrated initial product-market fit',
        'Early revenue indicates strong value proposition',
        'Your AI technology is solving real customer problems'
      ];
      recommendations = [
        'Scale your customer acquisition channels',
        'Invest in improving your AI model accuracy and performance',
        'Develop enterprise sales capabilities for larger deals',
        'Build robust analytics to track customer success metrics'
      ];
    } else {
      description = 'Your AI SaaS demonstrates strong fundamentals with excellent growth metrics.';
      insights = [
        'Your business shows mature growth patterns',
        'Strong market position with established customer base',
        'Proven scalability in your AI technology stack'
      ];
      recommendations = [
        'Explore international market expansion opportunities',
        'Consider strategic acquisitions to enhance your AI capabilities',
        'Develop premium enterprise features for higher-value customers',
        'Build advanced AI features to maintain competitive advantage'
      ];
    }

    return (
      <div className="w-full max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20 backdrop-blur-lg border border-white/20 rounded-xl p-8 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-[#D946EE] mr-3" />
            <h2 className="exo-2-heading text-3xl font-bold text-white">Your AI SaaS Business Valuation</h2>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-[#D946EE] mb-2">
              {formatNumber(valuation.low)} - {formatNumber(valuation.high)}
            </div>
            <p className="text-white/90 text-lg">{description}</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <TrendingUp className="h-6 w-6 text-[#0EA4E9] mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Growth Stage</h4>
              <p className="text-white/80 text-sm">
                {stage <= 2 ? 'Early Stage' : stage <= 3 ? 'Growth Stage' : 'Mature Stage'}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <DollarSign className="h-6 w-6 text-[#8B5CF6] mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Revenue</h4>
              <p className="text-white/80 text-sm">
                {mrr === 0 ? 'Pre-revenue' : mrr <= 1000 ? 'Early Revenue' : mrr <= 25000 ? 'Growing Revenue' : 'Strong Revenue'}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <Users className="h-6 w-6 text-[#D946EE] mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Customer Base</h4>
              <p className="text-white/80 text-sm">
                {customers === 0 ? 'Pre-customers' : customers <= 75 ? 'Growing Base' : 'Established Base'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass p-6 rounded-xl text-left">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-[#0EA4E9]" />
              Key Insights
            </h3>
            <ul className="space-y-3">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-[#0EA4E9] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-white/90 text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-6 rounded-xl text-left">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <ArrowRight className="h-5 w-5 mr-2 text-[#8B5CF6]" />
              Recommendations
            </h3>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-white/90 text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Thank You Section with Sell Button */}
        <div className="glass p-8 rounded-xl">
          <h3 className="text-2xl font-semibold text-white mb-4">Thank You!</h3>
          <p className="text-white/90 mb-6 text-lg">
            Your valuation has been calculated based on current market data and AI SaaS business metrics.
            We'll be in touch with additional insights and opportunities.
          </p>
          
          <div className="bg-gradient-to-r from-[#D946EE]/10 to-[#8B5CF6]/10 rounded-lg p-6 mb-6">
            <h4 className="text-white font-semibold mb-2">Ready to sell your AI SaaS business?</h4>
            <p className="text-white/80 text-sm mb-4">
              Connect with qualified buyers and maximize your business value through our secure marketplace.
            </p>
            <Button
              onClick={() => navigate('/marketplace/list')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#D946EE]/90 hover:to-[#8B5CF6]/90 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sell Your AI SaaS Business
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <p className="text-white/70 text-sm">
            💡 <strong>Pro tip:</strong> Businesses with verified metrics typically sell for 20-30% higher valuations
          </p>
        </div>
      </div>
    );
  }

  // Show quiz questions
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
                  answers[currentQuestion] === option.value
                    ? 'border-[#D946EE] bg-[#D946EE]'
                    : 'border-white/50'
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
            {currentQuestion === totalQuestions - 1 ? 'Complete Quiz' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
