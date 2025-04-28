import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Star, Trophy, Lightbulb } from "lucide-react";
import { QuizQuestions } from "@/components/hero/quiz/QuizQuestions";
import { ResultsForm } from "@/components/hero/quiz/ResultsForm";
import { ConfirmationScreen } from "@/components/hero/quiz/ConfirmationScreen";
import { quizQuestions } from "@/components/hero/quiz/quizQuestions";
import { useQuizSubmission } from "@/components/hero/quiz/hooks/useQuizSubmission";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";

export const AISaasQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const {
    showResults,
    setShowResults,
    showConfirmation,
    formData,
    setFormData,
    handleSubmit
  } = useQuizSubmission();
  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  const handleNext = () => {
    if (currentQuestion === quizQuestions.length) {
      setShowResults(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  const progress = currentQuestion / quizQuestions.length * 100;

  return (
    <AnimatedGradientBackground>
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-4 md:mb-8 max-w-4xl mx-auto mt-20">
          <div className="space-y-3 md:space-y-4">
            <h1 className="exo-2-heading sm:text-3xl md:text-5xl lg:text-3xl text-white leading-tight text-3xl">
              What's Your AI SaaS Business Really Worth?
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-2">
              Get an instant, data-driven valuation based on current market conditions
              and actual AI SaaS sales data.
            </p>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-4 md:p-8 mb-6 md:mb-12 mx-auto">
          <div className="mb-4">
            <div className="h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-[#6366f1] rounded-full transition-all duration-300" 
                style={{width: `${progress}%`}} 
              />
            </div>
          </div>

          {!showResults && !showConfirmation && <QuizQuestions currentQuestion={currentQuestion} questions={quizQuestions} answers={answers} onAnswerSelect={handleOptionSelect} onNext={handleNext} onPrevious={handlePrevious} />}

          {showResults && !showConfirmation && <ResultsForm formData={formData} onFormChange={setFormData} onSubmit={handleSubmit} />}

          {showConfirmation && <ConfirmationScreen email={formData.email} />}
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
    </AnimatedGradientBackground>
  );
};

export default AISaasQuiz;
