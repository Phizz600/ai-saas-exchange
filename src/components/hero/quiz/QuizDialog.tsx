
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QuizQuestions } from "./quiz/QuizQuestions";
import { ResultsForm } from "./quiz/ResultsForm";
import { LoadingScreen } from "./quiz/LoadingScreen";
import { ConfirmationScreen } from "./quiz/ConfirmationScreen";
import { ValuationResults } from "./quiz/ValuationResults";
import { quizQuestions } from "./quiz/quizQuestionsData";
import { useQuizSubmission } from "./quiz/hooks/useQuizSubmission";

interface QuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuizDialog = ({ open, onOpenChange }: QuizDialogProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const {
    showResults,
    showConfirmation,
    isLoading,
    formData,
    setFormData,
    handleSubmit,
    calculateValuation,
    valuationResult,
    showValuationResults,
    proceedToContactForm
  } = useQuizSubmission();

  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Store answers in localStorage for persistence
    localStorage.setItem('quizAnswers', JSON.stringify({
      ...answers,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion === quizQuestions.length) {
      // Move to contact form instead of calculating valuation immediately
      proceedToContactForm();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <div className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#9B87F5] p-6 -m-6 mb-6 rounded-t-lg">
          <h2 className="exo-2-heading text-white text-xl text-center">
            What's your AI SaaS Business Really Worth?
          </h2>
          <p className="text-white/90 text-sm text-center mt-2">
            Get a free estimate of your AI SaaS worth in just 60 seconds
          </p>
        </div>

        {!isLoading && !showValuationResults && !showResults && !showConfirmation && (
          <>
            <div className="h-2 bg-gray-100 rounded-full mb-6">
              <div
                className="h-full bg-[#6366f1] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <QuizQuestions
              currentQuestion={currentQuestion}
              questions={quizQuestions}
              answers={answers}
              onAnswerSelect={handleOptionSelect}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </>
        )}
        
        {isLoading && <LoadingScreen />}

        {showValuationResults && valuationResult && (
          <ValuationResults 
            valuation={valuationResult} 
            onContinue={proceedToContactForm} 
          />
        )}

        {showResults && !showConfirmation && (
          <ResultsForm
            formData={formData}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
            isPreValuation={true}
          />
        )}

        {showConfirmation && <ConfirmationScreen email={formData.email} />}
      </DialogContent>
    </Dialog>
  );
};
