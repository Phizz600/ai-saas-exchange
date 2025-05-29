import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    let description = '';
    if (stage <= 2) {
      description = 'Your AI SaaS is in early stages. Focus on product development and initial customer validation to increase value.';
    } else if (stage <= 3) {
      description = 'Your business shows promise with early traction. Scaling customer acquisition and improving metrics will drive higher valuations.';
    } else {
      description = 'Your AI SaaS demonstrates strong fundamentals. Continue optimizing growth metrics and market expansion for premium valuations.';
    }

    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20 backdrop-blur-lg border border-white/20 rounded-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Your AI SaaS Business Valuation</h2>
          <div className="text-4xl font-bold text-[#D946EE] mb-4">
            {formatNumber(valuation.low)} - {formatNumber(valuation.high)}
          </div>
          <p className="text-white/90 text-lg">{description}</p>
        </div>
        
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Thank You!</h3>
          <p className="text-white/90">
            Your valuation has been calculated based on current market data and AI SaaS business metrics.
            We'll be in touch with additional insights and opportunities.
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
