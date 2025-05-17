
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CircleAlert, Book } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  return (
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4 text-center">대시보드</h1>
      </div>
      
      {/* Welcome Card */}
      <div className="mx-4 mb-6 bg-opic-purple rounded-xl p-5 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium mb-1">안녕하세요, 게스트 사용자님!</h2>
            <p className="text-sm opacity-90">오늘도 영어 실력을 향상시켜 보세요.</p>
          </div>
          <div className="bg-white/20 rounded-full p-2">
            <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border-2 border-opic-purple"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">진행 상황</span>
            <span className="text-sm">3/5</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
      
      {/* Start New Practice */}
      <div className="mx-4 mb-6">
        <h2 className="text-lg font-medium mb-4">새로운 연습 시작하기</h2>
        <Link to="/practice" className="block bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-opic-light-purple flex items-center justify-center text-opic-purple">
              <BookOpen size={24} />
            </div>
            <div className="ml-4">
              <h3 className="font-medium">OPIc 연습 시작</h3>
              <p className="text-sm text-gray-500">레벨을 선택하고 연습을 시작하세요</p>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Subscription Plan */}
      <div className="mx-4 mb-6">
        <h2 className="text-lg font-medium mb-4">구독 플랜</h2>
        <div className="bg-opic-light-purple border border-dashed border-opic-purple rounded-lg p-4">
          <div className="mb-2">현재 무료 플랜 이용 중</div>
          <p className="text-sm text-gray-600 mb-4">
            프리미엄 기능으로 업그레이드하여 더 많은 템플릿과 기능을 사용해 보세요.
          </p>
          <Link 
            to="/plans" 
            className="block text-center bg-opic-purple text-white py-3 px-4 rounded-lg w-full"
          >
            프리미엄으로 업그레이드
          </Link>
        </div>
      </div>
      
      {/* Recent Practice */}
      <div className="mx-4 mb-6">
        <h2 className="text-lg font-medium mb-4">최근 연습</h2>
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-sm text-gray-500">
              <span>2023-05-15</span>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Intermediate</Badge>
          </div>
          <h3 className="font-medium mb-2">일상생활에 대해 이야기해보세요</h3>
          <p className="text-sm text-gray-500 mb-1">유창성 점수</p>
          <ProgressBar progress={85} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
