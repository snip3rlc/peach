
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface TriviaOption {
  text: string;
  isCorrect: boolean;
}

interface DailyTriviaProps {
  question: string;
  options: TriviaOption[];
}

const DailyTrivia = ({ question, options }: DailyTriviaProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleOptionClick = (option: TriviaOption) => {
    setSelectedOption(option.text);
    setShowAnswer(true);
  };

  const getButtonVariant = (option: TriviaOption) => {
    if (!showAnswer) return "outline";
    if (option.isCorrect) return "default";
    return option.text === selectedOption ? "destructive" : "outline";
  };

  return (
    <div className="w-full mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-medium">✏️ 오늘의 문제</h2>
        <p className="text-sm text-gray-500">
          매일 새로운 영어 문제를 풀어보세요.
        </p>
      </div>

      <Card className="shadow-md">
        <CardContent className="py-4 px-5">
          <p className="text-base mb-4 font-medium">{question}</p>
          <div className="flex gap-3">
            {options.map((option, index) => (
              <Button
                key={index}
                variant={getButtonVariant(option)}
                className="flex-1"
                onClick={() => handleOptionClick(option)}
                disabled={showAnswer}
              >
                {option.text}
                {showAnswer && option.isCorrect && (
                  <Check className="ml-2 h-4 w-4 text-white" />
                )}
                {showAnswer && !option.isCorrect && option.text === selectedOption && (
                  <X className="ml-2 h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
          
          {showAnswer && (
            <div className="mt-3 text-sm">
              <p className={selectedOption === options.find(o => o.isCorrect)?.text ? "text-green-600" : "text-red-600"}>
                {selectedOption === options.find(o => o.isCorrect)?.text 
                  ? "정답입니다! 👏" 
                  : `틀렸습니다. 정답은 "${options.find(o => o.isCorrect)?.text}"입니다.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTrivia;
