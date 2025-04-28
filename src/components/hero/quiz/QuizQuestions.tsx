
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [showError, setShowError] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
  }, [answers]);

  const question = questions[currentQuestion - 1];

  const handleNext = () => {
    if (!answers[question.id]) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onNext();
  };

  const handleOptionSelect = (questionId: number, value: string) => {
    setShowError(false);
    onAnswerSelect(questionId, value);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-sm text-gray-500 font-medium mb-2">
        Question {currentQuestion} of {questions.length}
      </div>
      <h3 className="text-lg md:text-xl font-semibold">
        {question?.question}
      </h3>
      <div className="grid gap-3 md:gap-4">
        {question?.options.map((option) => (
          <Button
            key={option.value}
            variant={answers[question.id] === option.value ? "secondary" : "outline"}
            className={`w-full justify-start min-h-[44px] text-sm md:text-base px-3 py-2 whitespace-normal text-left hover:bg-[#818CF8] hover:text-white ${
              answers[question.id] === option.value ? "bg-[#818CF8] text-white" : ""
            }`}
            onClick={() => handleOptionSelect(question.id, option.value)}
          >
            {option.icon && <span className="mr-2 flex-shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </Button>
        ))}
      </div>

      {showError && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            Please select an answer before proceeding
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between pt-2">
        {currentQuestion > 1 && (
          <Button 
            variant="ghost" 
            onClick={onPrevious}
            className="text-sm md:text-base hover:bg-[#818CF8] hover:text-white"
          >
            Previous
          </Button>
        )}
        <Button 
          onClick={handleNext}
          className={`text-sm md:text-base bg-[#818CF8] hover:opacity-90 ${currentQuestion === 1 ? 'ml-auto' : ''}`}
        >
          {currentQuestion === questions.length ? "See Results" : "Next"}
        </Button>
      </div>
    </div>
  );
};
