
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuizQuestion } from "./types";

interface QuizQuestionsProps {
  currentQuestion: number;
  questions: QuizQuestion[];
  answers: Record<number, string>;
  onAnswerSelect: (questionId: number, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const QuizQuestions = ({
  currentQuestion,
  questions,
  answers,
  onAnswerSelect,
  onNext,
  onPrevious
}: QuizQuestionsProps) => {
  const { toast } = useToast();
  const question = questions[currentQuestion - 1];

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast({
        title: "Please select an option",
        description: "Choose an option to continue to the next question",
        variant: "destructive"
      });
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="font-semibold text-base sm:text-lg">
        {question.question}
      </div>
      <div className="space-y-3">
        {question.options.map(option => (
          <button
            key={option.value}
            onClick={() => onAnswerSelect(currentQuestion, option.value)}
            className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all ${
              answers[currentQuestion] === option.value
                ? "border-[#6366f1] bg-[#f0f4ff]"
                : "border-gray-200 hover:border-[#6366f1] hover:bg-[#f5f7ff]"
            }`}
          >
            <div className="flex items-center gap-2">
              {option.icon && <span>{option.icon}</span>}
              <span className="text-sm sm:text-base">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={onPrevious} 
          disabled={currentQuestion === 1}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button 
          onClick={handleNext} 
          className="w-full sm:w-auto order-1 sm:order-2 bg-[6366F1] bg-indigo-500 hover:bg-indigo-400"
        >
          {currentQuestion === questions.length ? (
            <>Calculate My Valuation</>
          ) : (
            <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
};
