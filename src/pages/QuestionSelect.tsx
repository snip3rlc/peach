
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  level: string;
  topic: string;
  question_type: string;
  style: string;
  question: string;
  order: number | null;
}

const QuestionSelect = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const level = queryParams.get('level') || 'intermediate';
  const topic = queryParams.get('topic') || '';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('Fetching questions for level:', level, 'topic:', topic);
        
        if (!topic) {
          console.error('No topic provided');
          setIsLoading(false);
          return;
        }
        
        // Build the query to match both level and topic exactly
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('level', level)
          .eq('topic', topic);
        
        if (error) {
          throw error;
        }
        
        console.log('Raw questions data:', data);
        
        // Filter out invalid questions - be more strict
        const validQuestions = (data || []).filter(q => {
          // Filter out questions that might be headers or invalid data
          if (!q.question || typeof q.question !== 'string') return false;
          
          const question = q.question.trim();
          
          const invalidPatterns = [
            /^question\s*\d*$/i,
            /^no$/i,
            /^yes$/i,
            /^topic$/i,
            /^level$/i,
            /^type$/i,
            /^style$/i,
            /^order$/i,
            /^\s*$/,
            /^\d+$/,
            /^[a-z]\d*$/i
          ];
          
          // Only include questions that are meaningful (longer than 5 characters and not matching invalid patterns)
          return question.length > 5 && !invalidPatterns.some(pattern => pattern.test(question));
        });
        
        console.log('Filtered questions:', validQuestions);
        setQuestions(validQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, [level, topic]);

  // Get badge color based on level
  const getBadgeColor = (questionLevel: string) => {
    return questionLevel === 'intermediate' 
      ? 'bg-blue-100 text-blue-700' 
      : 'bg-green-100 text-green-700';
  };
  
  // Format level label for display
  const formatLevel = (questionLevel: string) => {
    return questionLevel.charAt(0).toUpperCase() + questionLevel.slice(1);
  };

  // Truncate question to 2 sentences
  const truncateQuestion = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return text;
    return sentences.slice(0, 2).join('. ') + '...';
  };

  return (
    <div className="pb-20 font-sans">
      <Header title="Questions" showBack />
      
      <div className="p-4">
        <div className="bg-purple-50 rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">연습할 질문을 선택하세요</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            현재 레벨과 주제에 맞는 질문이 제공됩니다. 응답을 연습하고 싶은 질문을 선택하세요.
          </p>
          {topic && (
            <div className="mt-3">
              <span className="inline-block px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs rounded-full font-medium">
                {topic} • {formatLevel(level)}
              </span>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-gray-500">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-2">No questions found for this topic.</p>
            <p className="text-sm text-gray-400">
              {topic ? `Try selecting a different topic or level.` : 'Please select a topic first.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((question) => (
              <Link 
                key={question.id}
                to={`/record-answer?id=${question.id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-3 transition-all duration-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="relative">
                  <div className="flex gap-2 mb-2">
                    <Badge className={`${getBadgeColor(question.level)} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                      {formatLevel(question.level)}
                    </Badge>
                    {question.style && (
                      <Badge className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {question.style}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[13px] text-gray-900 leading-relaxed line-clamp-2">
                    {truncateQuestion(question.question)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionSelect;
