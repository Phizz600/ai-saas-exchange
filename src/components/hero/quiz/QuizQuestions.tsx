import React from 'react';
import { Button } from "@/components/ui/button";
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
  React.useEffect(() => {
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
  }, [answers]);
  const question = questions[currentQuestion - 1];
  return <div className="space-y-4 md:space-y-6">
      <h3 className="text-lg md:text-xl font-semibold">
        {question?.question}
      </h3>
      <div className="grid gap-3 md:gap-4">
        {question?.options.map(option => <Button key={option.value} variant={answers[question.id] === option.value ? "secondary" : "outline"} className="w-full justify-start min-h-[44px] text-sm md:text-base px-3 py-2 whitespace-normal text-left" onClick={() => onAnswerSelect(question.id, option.value)}>
            {option.icon && <span className="mr-2 flex-shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </Button>)}
      </div>
      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onPrevious} disabled={currentQuestion === 1} className="text-sm md:text-base">
          Previous
        </Button>
        <Button onClick={onNext} className="text-sm md:text-base bg-indigo-500 hover:bg-indigo-400">
          {currentQuestion === questions.length ? "See Results" : "Next"}
        </Button>
      </div>
    </div>;
};