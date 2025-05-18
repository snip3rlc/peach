
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CircleAlert, Book, Headphones } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Language tips and facts data
const languageTips = [
  {
    emoji: '💡',
    title: '대화 팁',
    content: '질문에 답할 때는 예시를 들어 설명하면 더 명확해집니다.',
    example: '"What do you like about your job?" → "I like the creative aspects, for example, designing new solutions."'
  },
  {
    emoji: '🌍',
    title: '언어 사실',
    content: '영어에는 약 170,000개의 단어가 있지만, 원어민들은 일상 대화에서 3,000단어만 사용합니다.',
    example: null
  },
  {
    emoji: '💡',
    title: '대화 팁',
    content: '대화 중 모르는 단어가 나오면, "Could you explain what that means?" 라고 물어보세요.',
    example: 'A: "The situation is quite nebulous." B: "Could you explain what nebulous means?"'
  },
  {
    emoji: '🌍',
    title: '언어 사실',
    content: '영어와 한국어는 문장 구조가 다릅니다. 영어는 주어-동사-목적어 순서지만, 한국어는 주어-목적어-동사 순서입니다.',
    example: null
  },
  {
    emoji: '💡',
    title: '대화 팁',
    content: '자신감 있게 말하려면 속도보다 명확함에 집중하세요.',
    example: '"I think... um... the best solution is... to practice regularly" → "I believe regular practice is the best solution."'
  }
];

const Dashboard = () => {
  // Get a random tip that changes daily (or randomly if you prefer)
  const randomTip = useMemo(() => {
    // For daily change, use the current date as seed
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seed % languageTips.length;
    return languageTips[index];
    
    // For completely random selection on each render, use:
    // return languageTips[Math.floor(Math.random() * languageTips.length)];
  }, []);

  return (
    <div>
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
      
      {/* Daily Expression Card */}
      <div className="mx-4 mb-6">
        <h2 className="text-lg font-medium mb-4">오늘의 표현</h2>
        <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-opic-purple">"I'm swamped"</h3>
              <p className="text-gray-700 mb-2">바빠서 정신이 없어요</p>
              <p className="text-sm text-gray-600 italic">"I can't meet today, I'm totally swamped with work."</p>
            </div>
            <button className="flex flex-col items-center justify-center text-opic-purple">
              <Headphones size={24} />
              <span className="text-xs mt-1">듣기</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Conversation Tip or Language Fact Card (replaces Premium Plan) */}
      <div className="mx-4 mb-6">
        <h2 className="text-lg font-medium mb-4">{randomTip.emoji} {randomTip.title}</h2>
        <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
          <div>
            <p className="text-gray-700 mb-2">{randomTip.content}</p>
            {randomTip.example && (
              <p className="text-sm text-gray-600 italic">{randomTip.example}</p>
            )}
          </div>
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
