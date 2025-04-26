
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QuizQuestions } from "./quiz/QuizQuestions";
import { ResultsForm } from "./quiz/ResultsForm";
import { ConfirmationScreen } from "./quiz/ConfirmationScreen";
import { quizQuestions } from "./quiz/quizQuestions";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] p-6 -m-6 mb-6 rounded-t-lg">
          <h2 className="text-white text-xl font-bold text-center">
            What's your AI SaaS Businesses' Really Worth?
          </h2>
          <p className="text-white/90 text-sm text-center mt-2">
            Get a free estimate of your AI SaaS worth in just 60 seconds
          </p>
        </div>

        <div className="h-2 bg-gray-100 rounded-full mb-6">
          <div
            className="h-full bg-[#6366f1] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!showResults && !showConfirmation && (
          <QuizQuestions
            currentQuestion={currentQuestion}
            questions={quizQuestions}
            answers={answers}
            onAnswerSelect={handleOptionSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {showResults && !showConfirmation && (
          <ResultsForm
            formData={formData}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
          />
        )}

        {showConfirmation && <ConfirmationScreen email={formData.email} />}
      </DialogContent>
    </Dialog>
  );
};
