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
  // Store answers in localStorage when they change
  React.useEffect(() => {
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
  }, [answers]);

  const question = questions[currentQuestion - 1];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        {question?.question}
      </h3>
      <div className="grid gap-4">
        {question?.options.map((option) => (
          <Button
            key={option.value}
            variant={answers[question.id] === option.value ? "secondary" : "outline"}
            className="justify-start"
            onClick={() => onAnswerSelect(question.id, option.value)}
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
          </Button>
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrevious} disabled={currentQuestion === 1}>
          Previous
        </Button>
        <Button onClick={onNext}>
          {currentQuestion === questions.length ? "See Results" : "Next"}
        </Button>
      </div>
    </div>
  );
};
