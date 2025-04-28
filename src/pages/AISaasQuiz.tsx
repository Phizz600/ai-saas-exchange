import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Star, Trophy, Lightbulb } from "lucide-react";
import { QuizQuestions } from "@/components/hero/quiz/QuizQuestions";
import { ResultsForm } from "@/components/hero/quiz/ResultsForm";
import { ConfirmationScreen } from "@/components/hero/quiz/ConfirmationScreen";
import { quizQuestions } from "@/components/hero/quiz/quizQuestions";
import { useQuizSubmission } from "@/components/hero/quiz/hooks/useQuizSubmission";
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
  return <div className="min-h-screen bg-gradient-to-b from-[#13293D] to-[#18435A]">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="exo-2-heading text-3xl md:text-6xl text-white mb-4 md:mb-6 leading-tight">
            What's Your AI SaaS Business Really Worth?
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto">
            Get an instant, data-driven valuation based on current market conditions
            and actual AI SaaS sales data.
          </p>
        </div>

        {/* Quiz Section */}
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-4 md:p-8 mb-8 md:mb-16">
          <div className="mb-4 md:mb-6">
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-full bg-[#6366f1] rounded-full transition-all duration-300" style={{
              width: `${progress}%`
            }} />
            </div>
          </div>

          {!showResults && !showConfirmation && <QuizQuestions currentQuestion={currentQuestion} questions={quizQuestions} answers={answers} onAnswerSelect={handleOptionSelect} onNext={handleNext} onPrevious={handlePrevious} />}

          {showResults && !showConfirmation && <ResultsForm formData={formData} onFormChange={setFormData} onSubmit={handleSubmit} />}

          {showConfirmation && <ConfirmationScreen email={formData.email} />}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16">
          <div className="glass p-4 md:p-6 text-center">
            <Star className="h-6 w-6 md:h-8 md:w-8 text-[#D946EE] mx-auto mb-3 md:mb-4" />
            <h3 className="text-white font-semibold mb-2">60-Second Quiz</h3>
            <p className="text-sm md:text-base text-white/80">
              Quick, focused questions to accurately assess your AI SaaS value
            </p>
          </div>
          <div className="glass p-4 md:p-6 text-center">
            <Trophy className="h-6 w-6 md:h-8 md:w-8 text-[#8B5CF6] mx-auto mb-3 md:mb-4" />
            <h3 className="text-white font-semibold mb-2">Market Data-Driven</h3>
            <p className="text-sm md:text-base text-white/80">
              Valuations based on real AI SaaS marketplace transactions
            </p>
          </div>
          <div className="glass p-4 md:p-6 text-center">
            <Lightbulb className="h-6 w-6 md:h-8 md:w-8 text-[#0EA4E9] mx-auto mb-3 md:mb-4" />
            <h3 className="text-white font-semibold mb-2">Expert Insights</h3>
            <p className="text-sm md:text-base text-white/80">
              Get actionable recommendations to increase your business value
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-8 md:mb-16">
          <p className="text-white/80 mb-4">Trusted by 1,000+ AI founders</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            
            
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default AISaasQuiz;