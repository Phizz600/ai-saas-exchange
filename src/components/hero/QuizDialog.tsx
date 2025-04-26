
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { QuizQuestions } from "./quiz/QuizQuestions";
import { ResultsForm } from "./quiz/ResultsForm";
import { ConfirmationScreen } from "./quiz/ConfirmationScreen";
import { quizQuestions } from "./quiz/quizQuestions";
import { FormData } from "./quiz/types";

interface QuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuizDialog = ({ open, onOpenChange }: QuizDialogProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    sellingInterest: true
  });
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email to receive your valuation.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would typically send the data to your backend
      console.log("Form submitted with data:", {
        ...formData,
        answers
      });
      setShowConfirmation(true);
      toast({
        title: "Success!",
        description: "Your valuation has been sent to your email."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your valuation. Please try again.",
        variant: "destructive"
      });
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
