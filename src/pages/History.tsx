
import React from 'react';
import Header from '../components/Header';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const History = () => {
  return (
    <div className="pb-20">
      <Header title="기록" />
      
      <div className="p-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-yellow-100 rounded-full p-6 mb-4">
          <AlertTriangle className="w-10 h-10 text-yellow-500" />
        </div>
        
        <h2 className="text-xl font-medium mb-2">프리미엄 기능입니다</h2>
        <p className="text-center text-gray-600 mb-6">
          연습 히스토리는 프리미엄 또는 프로페셔널 구독자만 이용 가능합니다.
        </p>
        
        <Button
          onClick={() => window.location.href = '/plans'} 
          className="bg-opic-purple hover:bg-opic-dark-purple"
        >
          구독 업그레이드
        </Button>
      </div>
    </div>
  );
};

export default History;
