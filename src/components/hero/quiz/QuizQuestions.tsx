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
  const {
    toast
  } = useToast();
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
  return <div className="space-y-6">
      <div className="font-semibold text-lg">
        {question.question}
      </div>
      <div className="space-y-3">
        {question.options.map(option => <button key={option.value} onClick={() => onAnswerSelect(currentQuestion, option.value)} className={`w-full text-left p-4 rounded-lg border transition-all ${answers[currentQuestion] === option.value ? "border-[#6366f1] bg-[#f0f4ff]" : "border-gray-200 hover:border-[#6366f1] hover:bg-[#f5f7ff]"}`}>
            {option.icon && <span className="mr-3">{option.icon}</span>}
            {option.label}
          </button>)}
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious} disabled={currentQuestion === 1}>
          <ChevronLeft className="mr-2 h-4 w-4 py-[22px] px-0 mx-[35px] my-[4px]" /> Previous
        </Button>
        <Button onClick={handleNext} className="bg-[6366F1] bg-indigo-500 hover:bg-indigo-400">
          {currentQuestion === questions.length ? <>Calculate My Valuation</> : <>Next <ChevronRight className="ml-2 h-4 w-4" /></>}
        </Button>
      </div>
    </div>;
};