
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import GrammarChecker from '../components/GrammarChecker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface FeedbackItem {
  category: 'grammar' | 'fluency' | 'vocabulary';
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
  sampleAnswer: string;
  question: string;
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
        id: `history-${Date.now()}`,
        date: new Date().toISOString(),
        transcript: transcript,
        opicLevel: feedback.opicLevel,
        question: feedback.question,
        feedbackItems: feedback.items,
        sampleAnswer: feedback.sampleAnswer
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
      question: 'Tell me about your daily life.',
      opicLevel,
      items: [
        {
          category: 'grammar',
          feedback: hasGrammarIssues 
            ? "There are several grammar errors in your response that affect clarity. Focus on subject-verb agreement in your sentences. Make sure to use 'am' with 'I', 'is' with singular subjects, and 'are' with plural subjects."
            : "Your grammar is mostly correct with only minor errors. Continue practicing with more complex sentence structures to improve your grammar accuracy.",
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
          feedback: isShort 
            ? "Your answer is quite brief. Consider expanding with more details for better fluency. Try to connect your ideas with transition words like 'furthermore', 'moreover', 'in addition', etc. Aim for longer, more complex sentences to demonstrate higher fluency."
            : "You speak with good fluency, though there's room for more natural transitions. Try to vary your sentence structures more and use a wider range of connecting words to make your speech flow more naturally."
        },
        {
          category: 'vocabulary',
          feedback: hasRepetition 
            ? "You repeat the same phrases frequently. Try to use a wider range of vocabulary. Instead of repeating the same words, use synonyms and more specific terms to demonstrate a broader vocabulary range."
            : "You use a good range of vocabulary appropriate for the topic. To further improve, try incorporating more advanced vocabulary and idiomatic expressions in your responses."
        }
      ],
      sampleAnswer: "My daily routine starts at around 6:30 AM when I wake up. After brushing my teeth and washing my face, I usually have a light breakfast consisting of toast and a cup of coffee. I try to read the news or check my emails while eating. By 8:00 AM, I leave for work and typically arrive at the office by 8:30 AM. At work, I attend meetings, respond to emails, and work on various projects until lunchtime. I often bring my own lunch from home, but occasionally I go out to eat with my colleagues. After work, I like to exercise for about an hour, either by jogging in a nearby park or going to the gym. In the evening, I prepare dinner, watch some TV or read a book, and sometimes video call my family or friends. I try to go to bed by 11:00 PM to ensure I get enough rest for the next day."
    };
  };

  const getCorrectedAnswer = () => {
    if (!feedbackResult || !userAnswer) return userAnswer;
    
    let corrected = userAnswer;
    
    // Apply corrections from grammar issues
    feedbackResult.items.forEach(item => {
      if (item.issues && item.issues.length > 0) {
        item.issues.forEach(issue => {
          corrected = corrected.replace(new RegExp(issue.text, 'g'), 
            `<span class="line-through text-red-500">${issue.text}</span> <span class="text-green-600">${issue.correction}</span>`);
        });
      }
    });
    
    return corrected;
  };

  // Helper function to get background color for each category
  const getCategoryBackgroundColor = (category: string) => {
    switch (category) {
      case 'grammar':
        return 'bg-[#FEF7CD]'; // Light yellow
      case 'fluency':
        return 'bg-[#F2FCE2]'; // Light green
      case 'vocabulary':
        return 'bg-[#D3E4FD]'; // Light blue
      default:
        return 'bg-white';
    }
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
            {feedbackResult && (
              <>
                <div className="bg-opic-purple text-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4">
                  <h3 className="font-medium mb-3">{feedbackResult.question}</h3>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
                  <h3 className="font-medium mb-3">당신의 답변</h3>
                  <p className="text-sm text-gray-700">{userAnswer}</p>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
                  <Tabs defaultValue="feedback">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="feedback">피드백</TabsTrigger>
                      <TabsTrigger value="corrected">교정된 답변</TabsTrigger>
                      <TabsTrigger value="sample">샘플 답변</TabsTrigger>
                    </TabsList>
                    <TabsContent value="feedback" className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">전체 평가</h3>
                        <span className="text-2xl font-bold text-opic-purple">{feedbackResult.opicLevel}</span>
                      </div>
                      
                      <h4 className="font-medium text-sm mb-2">카테고리별 평가</h4>
                      {feedbackResult.items.map((item, index) => (
                        <div key={index} className={`mb-4 p-3 rounded-md ${getCategoryBackgroundColor(item.category)}`}>
                          <div className="mb-1">
                            <span className="text-sm font-medium capitalize">{item.category}</span>
                          </div>
                          <p className="text-sm mt-1 text-gray-600">{item.feedback}</p>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="corrected" className="p-4">
                      <h3 className="font-medium mb-3">교정된 답변</h3>
                      <div 
                        className="text-sm" 
                        dangerouslySetInnerHTML={{ __html: getCorrectedAnswer() }} 
                      />
                    </TabsContent>
                    <TabsContent value="sample" className="p-4">
                      <h3 className="font-medium mb-3">AI 샘플 답변</h3>
                      <p className="text-sm">{feedbackResult.sampleAnswer}</p>
                    </TabsContent>
                  </Tabs>
                </div>
                
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
