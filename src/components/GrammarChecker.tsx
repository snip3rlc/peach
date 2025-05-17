
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface GrammarCheckerProps {
  answer: string;
}

const GrammarChecker: React.FC<GrammarCheckerProps> = ({ answer }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkGrammar = () => {
    if (!answer || answer.trim().length === 0) {
      toast({
        title: "답변을 먼저 작성해주세요",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate grammar check (in a real app, this would call an API)
    setTimeout(() => {
      // Example feedback based on content length
      if (answer.length < 20) {
        setFeedback("답변이 너무 짧습니다. 더 자세하게 작성해보세요.");
      } else if (answer.includes('I is')) {
        setFeedback("문법 오류: 'I is' → 'I am'으로 수정하세요.");
      } else if (answer.includes('they is')) {
        setFeedback("문법 오류: 'they is' → 'they are'으로 수정하세요.");
      } else {
        setFeedback("답변이 자연스럽게 들립니다! 좋은 문법과 표현을 사용했습니다.");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="mt-6">
      <Button
        onClick={checkGrammar}
        className="w-full bg-opic-purple hover:bg-opic-dark-purple mb-4"
        disabled={loading}
      >
        {loading ? "분석 중..." : "저장 답변 검토하기"}
      </Button>
      
      {feedback && (
        <div className={`p-4 rounded-lg mt-2 ${feedback.includes("오류") ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
          <div className="flex">
            {feedback.includes("오류") ? (
              <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={20} />
            ) : (
              <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={20} />
            )}
            <p className={`text-sm ${feedback.includes("오류") ? "text-red-800" : "text-green-800"}`}>
              {feedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammarChecker;
