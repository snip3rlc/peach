
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import GrammarChecker from '../components/GrammarChecker';

interface FeedbackItem {
  category: 'grammar' | 'fluency' | 'vocabulary';
  score: number;
  feedback: string;
  issues?: {
    text: string;
    correction: string;
    explanation: string;
  }[];
}

interface FeedbackResult {
  opicLevel: string;
  items: FeedbackItem[];
  suggestions: string;
}

const Feedback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResult | null>(null);

  useEffect(() => {
    // Get the transcribed text from localStorage
    const transcript = localStorage.getItem('userSpeechTranscript');
    if (transcript) {
      setUserAnswer(transcript);
      
      // Simulate API call to get feedback
      // In a real application, this would be an actual API call to ChatGPT
      setTimeout(() => {
        const simulatedFeedback = generateSimulatedFeedback(transcript);
        setFeedbackResult(simulatedFeedback);
        setLoading(false);
        
        // Save result to history automatically
        saveResultToHistory(transcript, simulatedFeedback);
      }, 2000);
    } else {
      // If no transcript, provide default feedback
      setLoading(false);
      setUserAnswer('No answer recorded.');
    }
  }, []);
  
  // Function to save results to history
  const saveResultToHistory = (transcript: string, feedback: FeedbackResult) => {
    try {
      // Get existing history or initialize empty array
      const existingHistory = JSON.parse(localStorage.getItem('practiceHistory') || '[]');
      
      // Add current result to history
      const newHistoryItem = {
        date: new Date().toISOString(),
        transcript: transcript,
        opicLevel: feedback.opicLevel,
        scores: feedback.items.reduce((acc, item) => {
          acc[item.category] = item.score;
          return acc;
        }, {} as Record<string, number>),
        question: 'Tell me about your daily life.'
      };
      
      // Add to history and save back to localStorage
      localStorage.setItem('practiceHistory', JSON.stringify([newHistoryItem, ...existingHistory]));
      
      console.log('Result saved to history successfully');
    } catch (error) {
      console.error('Error saving result to history:', error);
    }
  };

  // This function simulates the ChatGPT API response
  // In a real application, this would be replaced with an actual API call
  const generateSimulatedFeedback = (text: string): FeedbackResult => {
    const hasGrammarIssues = text.includes('I is') || text.includes('they is') || text.includes('he are');
    const isShort = text.split(' ').length < 20;
    const hasRepetition = /(play soccer.*){2,}/i.test(text);
    
    // Determine OPIc level based on criteria
    let opicLevel = 'IM';
    if (hasGrammarIssues && isShort) {
      opicLevel = 'IL';
    } else if (!hasGrammarIssues && !isShort && !hasRepetition) {
      opicLevel = 'IH';
    } else if (!hasGrammarIssues && !isShort && hasRepetition) {
      opicLevel = 'IM2';
    } else if (text.length > 200 && !hasGrammarIssues && !isShort && !hasRepetition) {
      opicLevel = 'AL';
    }
    
    return {
      opicLevel,
      items: [
        {
          category: 'grammar',
          score: hasGrammarIssues ? 60 : 95,
          feedback: hasGrammarIssues 
            ? "There are several grammar errors in your response that affect clarity."
            : "Your grammar is mostly correct with only minor errors.",
          issues: hasGrammarIssues ? [
            {
              text: "I is",
              correction: "I am",
              explanation: "Use 'am' with the subject 'I', not 'is'."
            }
          ] : []
        },
        {
          category: 'fluency',
          score: isShort ? 70 : 85,
          feedback: isShort 
            ? "Your answer is quite brief. Consider expanding with more details for better fluency."
            : "You speak with good fluency, though there's room for more natural transitions."
        },
        {
          category: 'vocabulary',
          score: hasRepetition ? 65 : 88,
          feedback: hasRepetition 
            ? "You repeat the same phrases frequently. Try to use a wider range of vocabulary."
            : "You use a good range of vocabulary appropriate for the topic."
        }
      ],
      suggestions: hasGrammarIssues 
        ? "Focus on subject-verb agreement in your sentences."
        : (isShort 
            ? "Try to elaborate more on your daily activities and include more details." 
            : "Great job! Continue practicing with more complex sentence structures.")
    };
  };

  return (
    <div className="pb-20">
      <Header title="피드백 결과" showBack />
      
      <div className="p-4">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-4 border-opic-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-lg font-medium mb-2">답변 분석 중...</h2>
            <p className="text-gray-600 text-sm">AI가 당신의 답변을 분석하고 있습니다. 잠시만 기다려 주세요.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
              <h3 className="font-medium mb-3">당신의 답변</h3>
              <p className="text-sm text-gray-700">{userAnswer}</p>
            </div>
            
            {feedbackResult && (
              <>
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">전체 평가</h3>
                    <span className="text-2xl font-bold text-opic-purple">{feedbackResult.opicLevel}</span>
                  </div>
                  
                  <h4 className="font-medium text-sm mb-2">카테고리별 평가</h4>
                  {feedbackResult.items.map((item, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm capitalize">{item.category}</span>
                        <span className="text-sm font-medium">{item.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div 
                          className="bg-opic-purple h-2 rounded-full" 
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1 text-gray-600">{item.feedback}</p>
                      
                      {item.issues && item.issues.length > 0 && (
                        <div className="mt-2 bg-red-50 p-2 rounded">
                          {item.issues.map((issue, i) => (
                            <div key={i} className="text-xs">
                              <span className="text-red-500 line-through">{issue.text}</span>
                              {" → "}
                              <span className="text-green-600 font-medium">{issue.correction}</span>
                              <p className="text-gray-700 mt-1">{issue.explanation}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-opic-light-purple rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">개선 제안</h3>
                  <p className="text-sm">{feedbackResult.suggestions}</p>
                </div>
                
                <GrammarChecker answer={userAnswer} />
                
                <Button
                  onClick={() => navigate('/')}
                  className="w-full bg-opic-purple hover:bg-opic-dark-purple mt-6"
                >
                  연습 완료
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;
