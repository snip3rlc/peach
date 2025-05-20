import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

const QuestionSelect = () => {
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
        
        <div className="space-y-4">
          <Link 
            to="/record-answer"
            className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Novice</Badge>
                <h3 className="font-medium mb-1">Tell me about your daily life.</h3>
                <p className="text-sm text-gray-500">일상생활</p>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          </Link>
          
          <Link 
            to="/record-answer"
            className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Novice</Badge>
                <h3 className="font-medium mb-1">What do you usually do on weekends?</h3>
                <p className="text-sm text-gray-500">일상생활</p>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionSelect;
