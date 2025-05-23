
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  level: string;
  topic: string;
  question: string;
  question_type: string;
  style: string;
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
        let query = supabase
          .from('questions')
          .select('*')
          .eq('level', level);
          
        if (topic) {
          query = query.eq('topic', topic);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setQuestions(data || []);
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
      ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
      : 'bg-green-100 text-green-800 hover:bg-green-100';
  };
  
  // Format level label for display
  const formatLevel = (questionLevel: string) => {
    return questionLevel.charAt(0).toUpperCase() + questionLevel.slice(1);
  };

  return (
    <div className="pb-20">
      <Header title="Question" showBack />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-5 mb-6">
          <h2 className="text-lg font-medium mb-2">연습할 질문을 선택하세요</h2>
          <p className="text-sm text-gray-600">
            현재 레벨과 주제에 맞는 질문이 제공됩니다. 응답을 연습하고 싶은 질문을 선택하세요.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p>Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-10">
            <p>No questions found for this topic.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <Link 
                key={question.id}
                to={`/record-answer?id=${question.id}`}
                className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className={`mb-2 ${getBadgeColor(question.level)}`}>
                      {formatLevel(question.level)}
                    </Badge>
                    <h3 className="font-medium mb-1">{question.question}</h3>
                    <p className="text-sm text-gray-500">{question.topic}</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
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
