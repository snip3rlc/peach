
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

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
      <style>
        {`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(5px); }
          50% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); background-color: #22c55e; }
          100% { transform: scale(1); }
        }
        `}
      </style>

      <div className="mb-4">
        <h2 className="text-sm font-medium">오늘의 문제</h2>
      </div>

      <Card className="shadow-md border border-dotted border-[#A78BFA] rounded-[12px] p-[16px]">
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
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTrivia;
