
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";

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
  const [isCorrect, setIsCorrect] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleOptionClick = (option: TriviaOption) => {
    setSelectedOption(option.text);
    
    if (option.isCorrect) {
      setIsCorrect(true);
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 3000);
    } else {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        // Auto-reset after wrong answer
        setSelectedOption(null);
      }, 500);
    }
  };

  const getButtonVariant = (option: TriviaOption) => {
    if (!selectedOption) return "outline";
    if (selectedOption === option.text && option.isCorrect) return "default";
    if (selectedOption === option.text && !option.isCorrect) return "destructive";
    return "outline";
  };

  return (
    <div className="w-full mb-8">
      <div className="mb-4">
        <h2 className="text-sm font-medium">오늘의 문제</h2>
      </div>

      <Card className="shadow-md">
        <CardContent className="py-4 px-5">
          {showFireworks && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="animate-fade-in">
                <Sparkles className="text-yellow-400 w-24 h-24 absolute opacity-70" />
              </div>
            </div>
          )}
          
          <p className="text-base mb-4 font-medium">{question}</p>
          <div className="flex gap-3">
            {options.map((option, index) => (
              <Button
                key={index}
                variant={getButtonVariant(option)}
                className={`flex-1 transition-colors ${
                  selectedOption === option.text && !option.isCorrect ? "animate-[shake_0.5s_ease-in-out]" : ""
                } ${selectedOption === option.text && option.isCorrect ? "animate-[pulse_1s_ease-in-out]" : ""}`}
                onClick={() => handleOptionClick(option)}
                disabled={isCorrect}
              >
                {option.text}
                {selectedOption === option.text && option.isCorrect && (
                  <Check className="ml-2 h-4 w-4 text-white" />
                )}
                {selectedOption === option.text && !option.isCorrect && (
                  <X className="ml-2 h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
          
          {isCorrect && (
            <div className="mt-3">
              <p className="text-green-600">정답입니다! 👏</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTrivia;
