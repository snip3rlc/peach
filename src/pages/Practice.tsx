
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Zap, Trophy } from 'lucide-react';

const Practice = () => {
  return (
    <div className="pb-20">
      <Header title="Practice" />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-5 mb-6">
          <h2 className="text-base font-medium mb-2">연습할 레벨을 선택하세요</h2>
          <p className="text-sm text-gray-600">
            현재 영어 실력에 맞는 레벨을 선택하면 적합한 연습 문제와 템플릿을 제공해 드립니다.
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Intermediate - with larger text */}
          <Link 
            to="/topics"
            className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-500">
                <Zap size={24} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-base">Intermediate</h3>
                <p className="text-sm text-gray-500">다양한 주제에 대해 자세한 의견을 표현할 수 있는 단계</p>
              </div>
            </div>
          </Link>
          
          {/* Advanced - with larger text */}
          <Link 
            to="/topics"
            className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-500">
                <Trophy size={24} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-base">Advanced</h3>
                <p className="text-sm text-gray-500">복잡한 주제에 대해 유창하고 논리적으로 의견을 표현할 수 있는 단계</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Practice;
