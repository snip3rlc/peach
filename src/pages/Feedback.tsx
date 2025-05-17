
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';

const Feedback = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20">
      <Header title="피드백 결과" showBack />
      
      <div className="p-4 flex justify-center items-center min-h-[70vh]">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 border-4 border-opic-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-lg font-medium mb-2">답변 분석 중...</h2>
          <p className="text-gray-600 text-sm">AI가 당신의 답변을 분석하고 있습니다. 잠시만 기다려 주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
