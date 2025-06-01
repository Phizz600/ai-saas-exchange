import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, DollarSign, Target, ArrowRight, Sparkles, Shield, Clock, Zap } from "lucide-react";

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

const questions: Question[] = [{
  id: 1,
  title: "Business Development Stage",
  text: "What stage is your AI SaaS business currently in?",
  options: [{
    value: 1,
    label: "Idea/Concept Stage",
    description: "Still developing the core AI technology"
  }, {
    value: 2,
    label: "MVP/Beta",
    description: "Working prototype with initial testing"
  }, {
    value: 3,
    label: "Early Revenue",
    description: "Launched with first paying customers"
  }, {
    value: 4,
    label: "Growth Stage",
    description: "Established product with growing customer base"
  }, {
    value: 5,
    label: "Mature/Scale",
    description: "Well-established with significant market presence"
  }]
}, {
  id: 2,
  title: "Monthly Recurring Revenue",
  text: "What is your current Monthly Recurring Revenue (MRR)?",
  options: [{
    value: 0,
    label: "Pre-revenue / $0"
  }, {
    value: 1000,
    label: "$1 - $1,000"
  }, {
    value: 5000,
    label: "$1,001 - $10,000"
  }, {
    value: 25000,
    label: "$10,001 - $50,000"
  }, {
    value: 100000,
    label: "$50,001 - $200,000"
  }, {
    value: 500000,
    label: "$200,000+"
  }]
}, {
  id: 3,
  title: "Customer Base",
  text: "How many paying customers do you currently have?",
  options: [{
    value: 0,
    label: "0 customers"
  }, {
    value: 25,
    label: "1-50 customers"
  }, {
    value: 75,
    label: "51-100 customers"
  }, {
    value: 300,
    label: "101-500 customers"
  }, {
    value: 750,
    label: "500-1,000 customers"
  }, {
    value: 3000,
    label: "1,000-5,000 customers"
  }, {
    value: 10000,
    label: "10,000+ customers"
  }]
}, {
  id: 4,
  title: "AI Technology Focus",
  text: "What type of AI technology powers your SaaS?",
  options: [{
    value: 3,
    label: "Machine Learning/Predictive Analytics",
    description: "Data analysis, forecasting, recommendations"
  }, {
    value: 4,
    label: "Natural Language Processing",
    description: "Text analysis, chatbots, language understanding"
  }, {
    value: 5,
    label: "Computer Vision",
    description: "Image recognition, visual analysis"
  }, {
    value: 6,
    label: "Process Automation/RPA",
    description: "Workflow automation, intelligent processing"
  }, {
    value: 7,
    label: "Generative AI",
    description: "Content generation, creative AI applications"
  }, {
    value: 2,
    label: "Other/Multiple Technologies",
    description: "Combination or specialized AI tech"
  }]
}, {
  id: 5,
  title: "Growth Trajectory",
  text: "What's your monthly growth rate over the past 6 months?",
  options: [{
    value: 1,
    label: "Declining or no growth"
  }, {
    value: 2,
    label: "0-5% monthly growth"
  }, {
    value: 3,
    label: "5-15% monthly growth"
  }, {
    value: 4,
    label: "15-30% monthly growth"
  }, {
    value: 5,
    label: "30%+ monthly growth"
  }]
}, {
  id: 6,
  title: "Market Position",
  text: "How would you describe your competitive position?",
  options: [{
    value: 2,
    label: "Many Competitors",
    description: "Crowded market with similar solutions"
  }, {
    value: 3,
    label: "Some Competition",
    description: "Moderate competition with differentiation"
  }, {
    value: 4,
    label: "Limited Competition",
    description: "Few direct competitors in your niche"
  }, {
    value: 5,
    label: "Market Leader/Unique",
    description: "First mover or unique AI approach"
  }]
}, {
  id: 7,
  title: "Team & Intellectual Property",
  text: "What's the strength of your technical team and IP?",
  options: [{
    value: 2,
    label: "Solo founder or small team",
    description: "Limited technical expertise"
  }, {
    value: 3,
    label: "Small experienced team",
    description: "Good AI/tech background"
  }, {
    value: 4,
    label: "Strong technical team",
    description: "Deep AI expertise, some IP protection"
  }, {
    value: 5,
    label: "World-class team",
    description: "Top AI talent, patents, proprietary algorithms"
  }]
}, {
  id: 8,
  title: "Funding Status",
  text: "What's your current funding situation?",
  options: [{
    value: 1,
    label: "Bootstrapped / Self-funded"
  }, {
    value: 2,
    label: "Friends & Family / Angel ($0-$100K)"
  }, {
    value: 3,
    label: "Seed Round ($100K-$2M)"
  }, {
    value: 4,
    label: "Series A ($2M-$15M)"
  }, {
    value: 5,
    label: "Series B+ ($15M+)"
  }]
}];

export const AISaasQuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [showContactForm, setShowContactForm] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [valuation, setValuation] = useState({
    low: 0,
    high: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalQuestions = questions.length;
  const progress = (currentQuestion + 1) / totalQuestions * 100;

  const handleOptionSelect = (value: number) => {
    const newAnswers = {
      ...answers,
      [currentQuestion]: value
    };
    setAnswers(newAnswers);
    
    // Store answers in localStorage for the edge function
    localStorage.setItem('quizAnswers', JSON.stringify(newAnswers));
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
    let isRealistic = true;

    // Reality Check #1: No revenue + no customers = minimal value
    if (mrr === 0 && customers === 0) {
      calculatedValuation = Math.max(100, (team + techType) * 50);
      calculatedValuation = Math.min(calculatedValuation, 1000); // Cap at $1K
      isRealistic = false;
    }
    // Reality Check #2: No revenue but some customers = very low value
    else if (mrr === 0 && customers > 0) {
      calculatedValuation = 500 + customers * 2 + (team + market) * 100;
      calculatedValuation = Math.min(calculatedValuation, 3000); // Cap at $3K
      isRealistic = false;
    }
    // Reality Check #3: Minimal revenue = conservative valuation
    else if (mrr <= 1000) {
      let baseMultiplier = 8; // 8x annual revenue (conservative)
      if (stage === 1) baseMultiplier = 6; // Even more conservative for idea stage
      if (stage === 2) baseMultiplier = 7; // Slightly better for MVP

      calculatedValuation = mrr * 12 * baseMultiplier;

      // Apply growth penalty/bonus
      if (growth <= 1) calculatedValuation *= 0.6; // Declining growth penalty
      if (growth >= 4) calculatedValuation *= 1.3; // Strong growth bonus

      // Apply market position factor
      calculatedValuation *= 1 + (market - 2) * 0.1;

      // Cap low revenue businesses
      calculatedValuation = Math.min(calculatedValuation, 25000);
    }
    // Established businesses with real revenue
    else {
      let baseMultiplier = 3; // Start conservative

      // Stage-based multipliers (much more conservative)
      if (stage === 1) baseMultiplier = 2;
      if (stage === 2) baseMultiplier = 2.5;
      if (stage === 3) baseMultiplier = 3.5;
      if (stage === 4) baseMultiplier = 5;
      if (stage === 5) baseMultiplier = 6;
      calculatedValuation = mrr * 12 * baseMultiplier;

      // Growth rate adjustments (more realistic)
      if (growth === 1) calculatedValuation *= 0.5; // Declining
      if (growth === 2) calculatedValuation *= 0.8; // Slow growth
      if (growth === 3) calculatedValuation *= 1.1; // Moderate growth
      if (growth === 4) calculatedValuation *= 1.4; // Good growth
      if (growth === 5) calculatedValuation *= 1.8; // Exceptional growth

      // Market position (more conservative)
      if (market === 2) calculatedValuation *= 0.8; // Crowded market
      if (market === 3) calculatedValuation *= 1.0; // Some competition
      if (market === 4) calculatedValuation *= 1.2; // Limited competition
      if (market === 5) calculatedValuation *= 1.4; // Market leader

      // Team/IP factor (reduced impact)
      calculatedValuation *= 1 + (team - 2) * 0.1;

      // Tech type bonus (reduced)
      if (techType === 7) calculatedValuation *= 1.1; // Generative AI
      if (techType === 4) calculatedValuation *= 1.05; // NLP
      if (techType === 5) calculatedValuation *= 1.05; // Computer Vision
    }

    // Funding adjustment (minimal impact)
    if (funding >= 4) calculatedValuation *= 1.1;

    // Ensure minimum realistic floor
    if (calculatedValuation < 100) calculatedValuation = 100;

    // Calculate range (tighter for realism)
    const variance = isRealistic ? 0.15 : 0.25; // Smaller variance for established businesses
    const lowEnd = Math.round(calculatedValuation * (1 - variance));
    const highEnd = Math.round(calculatedValuation * (1 + variance));
    setValuation({
      low: Math.max(lowEnd, 100),
      high: highEnd
    });
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
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Starting quiz form submission for Brevo contact list");
      
      // Store in local database first
      const { error: dbError } = await supabase
        .from('valuation_leads')
        .insert([{
          name: formData.fullName,
          email: formData.email,
          company: formData.companyName,
          quiz_answers: answers
        }]);

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log("Successfully stored in database, now adding contact to Brevo list #7");

      // Prepare contact properties for Brevo
      const contactProperties = {
        NAME: formData.fullName,
        COMPANY: formData.companyName,
        ESTIMATED_VALUE_LOW: valuation.low,
        ESTIMATED_VALUE_HIGH: valuation.high,
        AI_CATEGORY: getAICategory(answers[3]),
        USER_COUNT: getUserCount(answers[2]),
        GROWTH_RATE: getGrowthRate(answers[4]),
        MARKET_POSITION: getMarketPosition(answers[5]),
        MRR: getMRR(answers[1]),
        BUSINESS_STAGE: getBusinessStage(answers[0]),
        TEAM_IP: getTeamIP(answers[6]),
        FUNDING_STATUS: getFundingStatus(answers[7]),
        SOURCE: 'ai_saas_valuation_quiz',
        QUIZ_DATE: new Date().toISOString()
      };

      console.log("Adding contact to Brevo list #7 with properties:", contactProperties);

      // Call simplified Brevo edge function
      const brevoResponse = await supabase.functions.invoke('send-brevo-email', {
        body: JSON.stringify({
          email: formData.email,
          contactProperties
        })
      });

      console.log("Brevo edge function response:", brevoResponse);
      
      if (brevoResponse.error) {
        console.error("Brevo edge function error:", brevoResponse.error);
        toast({
          title: "Warning",
          description: "Your information was saved but there was an issue adding you to our contact list.",
          variant: "default"
        });
      } else if (!brevoResponse.data?.success) {
        console.error("Brevo edge function returned failure:", brevoResponse.data);
        toast({
          title: "Warning",
          description: brevoResponse.data?.warning || "Your information was saved successfully.",
          variant: "default"
        });
      } else {
        console.log("Successfully added contact to Brevo list");
        toast({
          title: "Success!",
          description: "Your information has been saved successfully!"
        });
      }

      // Show results regardless of Brevo status
      setShowContactForm(false);
      setShowResults(true);

    } catch (error: any) {
      console.error('Error saving customer information:', error);
      toast({
        title: "Error",
        description: `There was a problem saving your information: ${error.message}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnswer = answers.hasOwnProperty(currentQuestion);

  // Show contact form after quiz completion
  if (showContactForm) {
    return <div className="w-full max-w-2xl mx-auto text-center">
        <div className="glass p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-6">Get Your AI SaaS Valuation</h3>
          <p className="text-white/90 text-lg mb-6">You're just one step away from discovering your AI SaaS business value! Just let us know where to send the results.</p>
          <div className="space-y-4">
            <input type="text" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData(prev => ({
            ...prev,
            fullName: e.target.value
          }))} disabled={isSubmitting} />
            <input type="email" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60" placeholder="Email Address" value={formData.email} onChange={e => setFormData(prev => ({
            ...prev,
            email: e.target.value
          }))} disabled={isSubmitting} />
            <input type="text" className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60" placeholder="AI SaaS Business/Company Name" value={formData.companyName} onChange={e => setFormData(prev => ({
            ...prev,
            companyName: e.target.value
          }))} disabled={isSubmitting} />
            <Button onClick={submitForm} disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#D946EE]/90 hover:to-[#8B5CF6]/90 text-white font-semibold py-3">
              {isSubmitting ? 'Processing...' : 'Get My Valuation'}
            </Button>
          </div>
        </div>
      </div>;
  }

  // Show results after successful form submission
  if (showResults) {
    const stage = answers[0] || 1;
    const mrr = answers[1] || 0;
    const customers = answers[2] || 0;
    let description = '';
    let insights = [];
    let recommendations = [];
    let disclaimer = '';

    // More realistic descriptions and disclaimers
    if (mrr === 0 && customers === 0) {
      description = 'Your AI SaaS is in the earliest conceptual stage.';
      disclaimer = '⚠️ Pre-revenue businesses typically have minimal market value until they demonstrate customer traction and revenue generation.';
      insights = ['Your business currently represents potential rather than proven value', 'Most buyers look for businesses with established revenue and customer base', 'Focus on achieving product-market fit before considering valuation'];
      recommendations = ['Develop a minimum viable product (MVP) to test market demand', 'Acquire your first paying customers to validate your business model', 'Document user feedback and iterate based on real customer needs', 'Consider this valuation as aspirational rather than current market value'];
    } else if (mrr === 0) {
      description = 'Your business shows early user interest but lacks revenue validation.';
      disclaimer = '⚠️ While user engagement is positive, buyers typically require proven revenue streams for meaningful valuations.';
      insights = ['User base indicates market interest in your solution', 'Revenue generation is critical for establishing market value', 'Converting users to paying customers should be your top priority'];
      recommendations = ['Implement monetization strategies to convert users to paying customers', 'Survey users to understand willingness to pay and optimal pricing', 'Develop premium features that justify subscription fees', 'Focus on retention metrics and user engagement quality'];
    } else if (mrr <= 1000) {
      description = 'Your business demonstrates early revenue traction with room for growth.';
      disclaimer = '💡 Early-stage revenues show promise, but buyers often seek businesses with $5K+ MRR for serious consideration.';
      insights = ['You have successfully validated initial product-market fit', 'Early revenue indicates customers find value in your solution', 'Growth trajectory will significantly impact future valuation'];
      recommendations = ['Focus aggressively on growing monthly recurring revenue', 'Optimize customer acquisition and retention strategies', 'Document all revenue metrics for future buyer verification', 'Consider this estimate preliminary - actual valuations require due diligence'];
    } else {
      description = 'Your AI SaaS shows strong fundamentals with meaningful revenue generation.';
      disclaimer = '📊 This estimate is based on limited data. Actual market value depends on verified metrics, competitive position, and buyer due diligence.';
      insights = ['Your business demonstrates proven market demand and revenue generation', 'Strong MRR indicates sustainable business model potential', 'Growth rate and market position are key value drivers'];
      recommendations = ['Maintain detailed financial records and metrics for buyer verification', 'Focus on sustainable growth and customer retention', 'Consider professional business valuation for precise market assessment', 'Prepare comprehensive documentation for potential buyer due diligence'];
    }
    return <div className="w-full max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20 backdrop-blur-lg border border-white/20 rounded-xl p-8 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-[#D946EE] mr-3" />
            <h2 className="exo-2-heading text-3xl font-bold text-white">Your AI SaaS Business Valuation</h2>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-[#D946EE] mb-2">
              {formatNumber(valuation.low)} - {formatNumber(valuation.high)}
            </div>
            <p className="text-white/90 text-lg mb-3">{description}</p>
            <div className="bg-white/5 rounded-lg p-3 text-sm text-white/80">
              {disclaimer}
            </div>
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

          {/* Why Sell With Us Section */}
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Ready to Turn Your AI Innovation Into Cash?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-start text-left">
                <Shield className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium text-sm">Secure Escrow</h4>
                  <p className="text-white/70 text-xs">Protected transactions via Escrow.com</p>
                </div>
              </div>
              <div className="flex items-start text-left">
                <Clock className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium text-sm">Quick Process</h4>
                  <p className="text-white/70 text-xs">Average sale completion in 30-60 days</p>
                </div>
              </div>
              <div className="flex items-start text-left">
                <Zap className="h-5 w-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium text-sm">AI-Focused Buyers</h4>
                  <p className="text-white/70 text-xs">Pre-qualified investors seeking AI assets</p>
                </div>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              Join 500+ AI founders who've successfully exited through our marketplace
            </p>
          </div>

          {/* Green Sell Button */}
          <div className="mt-8">
            <Button onClick={() => window.open('https://airtable.com/appqbmIOXXLNFhZyj/pagutIK7nf0unyJm3/form', '_blank')} className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold text-lg py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              ✨ Sell your AI SaaS Business
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass p-6 rounded-xl text-left">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-[#0EA4E9]" />
              Key Insights
            </h3>
            <ul className="space-y-3">
              {insights.map((insight, index) => <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-[#0EA4E9] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-white/90 text-sm">{insight}</span>
                </li>)}
            </ul>
          </div>

          <div className="glass p-6 rounded-xl text-left">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <ArrowRight className="h-5 w-5 mr-2 text-[#8B5CF6]" />
              Recommendations
            </h3>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-white/90 text-sm">{rec}</span>
                </li>)}
            </ul>
          </div>
        </div>
        
        <div className="glass p-8 rounded-xl">
          <h3 className="text-2xl font-semibold text-white mb-4">Important Disclaimer</h3>
          <p className="text-white/90 mb-6 text-lg">
            This valuation is a rough estimate based on limited survey data and general market trends.
          </p>
          
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <p className="text-white/80 text-sm">
              <strong>⚠️ Actual market value may differ significantly.</strong> Real business valuations require:
              verified financial records, comprehensive due diligence, competitive analysis, and detailed
              assessment of assets, liabilities, and growth potential.
            </p>
          </div>
          
          <p className="text-white/70 text-sm">
            💡 <strong>For serious buyers:</strong> Businesses with verified metrics, strong growth, and proven revenue typically command premium valuations
          </p>
        </div>
      </div>;
  }

  // Show quiz questions
  const currentQuestionData = questions[currentQuestion];
  return <div className="w-full max-w-2xl mx-auto">
      <div className="glass p-6 md:p-8 rounded-xl">
        {/* Progress Bar */}
        <div className="h-2 bg-white/20 rounded-full mb-6">
          <div className="h-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] rounded-full transition-all duration-300" style={{
          width: `${progress}%`
        }} />
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
          {currentQuestionData.options.map((option, index) => <div key={index} className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${answers[currentQuestion] === option.value ? 'bg-gradient-to-r from-[#D946EE]/30 to-[#8B5CF6]/30 border-[#D946EE] shadow-lg shadow-[#D946EE]/30' : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/40'}`} onClick={() => handleOptionSelect(option.value)}>
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-4 relative ${answers[currentQuestion] === option.value ? 'border-[#D946EE] bg-[#D946EE]' : 'border-white/50'}`}>
                  {answers[currentQuestion] === option.value && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <div className="text-white font-medium">{option.label}</div>
                  {option.description && <div className="text-white/70 text-sm mt-1">{option.description}</div>}
                </div>
              </div>
            </div>)}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button onClick={previousQuestion} disabled={currentQuestion === 0} variant="outline" className="border-white/30 text-white bg-white/15 hover:bg-white/15">
            Previous
          </Button>
          <Button onClick={nextQuestion} disabled={!hasAnswer} className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#D946EE]/90 hover:to-[#8B5CF6]/90 text-white">
            {currentQuestion === totalQuestions - 1 ? 'Complete Quiz' : 'Next'}
          </Button>
        </div>
      </div>
    </div>;
};

// Helper functions to map quiz answers to readable values
function getAICategory(answer: number): string {
  const categories = {
    3: 'Machine Learning',
    4: 'Natural Language Processing', 
    5: 'Computer Vision',
    6: 'Process Automation',
    7: 'Generative AI',
    2: 'Other/Multiple'
  };
  return categories[answer as keyof typeof categories] || 'Unknown';
}

function getUserCount(answer: number): string {
  const counts = {
    0: '0',
    25: '1-50',
    75: '51-100', 
    300: '101-500',
    750: '500-1,000',
    3000: '1,000-5,000',
    10000: '10,000+'
  };
  return counts[answer as keyof typeof counts] || 'Unknown';
}

function getGrowthRate(answer: number): string {
  const rates = {
    1: 'Declining/No Growth',
    2: '0-5%',
    3: '5-15%',
    4: '15-30%', 
    5: '30%+'
  };
  return rates[answer as keyof typeof rates] || 'Unknown';
}

function getMarketPosition(answer: number): string {
  const positions = {
    2: 'Many Competitors',
    3: 'Some Competition',
    4: 'Limited Competition',
    5: 'Market Leader'
  };
  return positions[answer as keyof typeof positions] || 'Unknown';
}

function getMRR(answer: number): string {
  const mrr = {
    0: '$0',
    1000: '$1-$1,000',
    5000: '$1,001-$10,000',
    25000: '$10,001-$50,000',
    100000: '$50,001-$200,000',
    500000: '$200,000+'
  };
  return mrr[answer as keyof typeof mrr] || 'Unknown';
}

function getBusinessStage(answer: number): string {
  const stages = {
    1: 'Idea/Concept',
    2: 'MVP/Beta',
    3: 'Early Revenue',
    4: 'Growth Stage',
    5: 'Mature/Scale'
  };
  return stages[answer as keyof typeof stages] || 'Unknown';
}

function getTeamIP(answer: number): string {
  const teams = {
    2: 'Solo/Small Team',
    3: 'Small Experienced Team',
    4: 'Strong Technical Team',
    5: 'World-class Team'
  };
  return teams[answer as keyof typeof teams] || 'Unknown';
}

function getFundingStatus(answer: number): string {
  const funding = {
    1: 'Bootstrapped',
    2: 'Friends & Family',
    3: 'Seed Round',
    4: 'Series A',
    5: 'Series B+'
  };
  return funding[answer as keyof typeof funding] || 'Unknown';
}
