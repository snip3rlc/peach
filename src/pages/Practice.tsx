
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { BookOpen } from 'lucide-react';

const Practice = () => {
  return (
    <div className="pb-20">
      <Header title="연습" />
      
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-opic-light-purple rounded-full flex items-center justify-center text-opic-purple mb-6">
          <BookOpen size={32} />
        </div>
        
        <h2 className="text-xl font-medium mb-2">OPIc 연습 시작하기</h2>
        <p className="text-gray-600 mb-8">레벨을 선택하고 연습을 시작해보세요!</p>
        
        <Link 
          to="/level-select" 
          className="bg-opic-purple text-white py-3 px-6 rounded-lg font-medium w-full max-w-md text-center"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
};

export default Practice;
