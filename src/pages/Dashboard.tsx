import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '../App';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import UpgradeCard from '../components/UpgradeCard';
import DidYouKnow from '../components/DidYouKnow';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [recentPractice, setRecentPractice] = useState<any>(null);
  
  // Fetch most recent practice
  useEffect(() => {
    const fetchRecentPractice = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .limit(1)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data && data.length > 0) {
          setRecentPractice(data[0]);
        }
      } catch (error) {
        console.error('Error fetching recent practice:', error);
      }
    };
    
    fetchRecentPractice();
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    
    // Check if correct (in this case, "to" is correct)
    const correct = answer === "to";
    setIsCorrect(correct);
    
    // Apply animation effect
    setTimeout(() => {
      if (!correct) {
        // Reset if wrong
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 1000);
  };
  
  const playAudio = () => {
    // In a real app, this would play the audio file
    toast.info("Playing audio...");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Welcome Card */}
      <div className="bg-opic-light-purple p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">안녕하세요, {user?.user_metadata?.full_name || '게스트'} 사용자님!</h2>
          <div className="bg-white rounded-full p-1">
            <span className="text-opic-purple">􀍡</span>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-3">오늘도 영어 실력을 향상시켜 보세요.</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm">진행 상황</span>
          <span className="text-sm">3/5</span>
        </div>
        
        <Button 
          className="w-full bg-white text-opic-purple hover:bg-gray-100"
          onClick={() => navigate('/practice')}
        >
          Let's start!
        </Button>
      </div>
      
      {/* Daily Expression Card */}
      <div className="p-4">
        <h3 className="text-sm font-medium mb-2">오늘의 표현</h3>
        
        <Card className="p-4 mb-4">
          <div className="flex justify-between">
            <div>
              <p className="font-medium mb-1">"I'm swamped"</p>
              <p className="text-sm text-gray-500">머리가 정신이 없어요</p>
            </div>
            <button 
              className="bg-gray-100 p-2 rounded-full"
              onClick={playAudio}
            >
              <Volume2 size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-600 italic mt-2">
            "I can't meet today, I'm totally swamped with work."
          </p>
        </Card>
        
        {/* Grammar Quiz Card */}
        <h3 className="text-sm font-medium mb-2">오늘의 문법</h3>
        
        <Card className="p-4 mb-4">
          <p className="mb-3">I'm happy <span className="underline">___</span> see you.</p>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAnswerSelect('to')}
              className={`flex-1 ${selectedAnswer === 'to' && isCorrect ? 'bg-green-100 border-green-500 text-green-700' : selectedAnswer === 'to' ? 'bg-red-100 border-red-500 text-red-700' : ''}`}
            >
              to
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => handleAnswerSelect('for')}
              className={`flex-1 ${selectedAnswer === 'for' ? 'bg-red-100 border-red-500 text-red-700' : ''}`}
            >
              for
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => handleAnswerSelect('in')}
              className={`flex-1 ${selectedAnswer === 'in' ? 'bg-red-100 border-red-500 text-red-700' : ''}`}
            >
              in
            </Button>
          </div>
        </Card>
        
        {/* Did You Know Card */}
        <h3 className="text-sm font-medium mb-2">알고 계셨나요?</h3>
        
        <Card className="p-4 mb-4">
          <p className="font-medium mb-2">"W"와 'double-V'처럼 보이는데 왜 'double-U'라고 부를까요?</p>
        </Card>
        
        {/* Practice Assistance Card */}
        <div className="bg-opic-light-purple rounded-lg p-4 mb-4">
          <p className="text-sm mb-4">
            연습하기 기능으로 진행하면서 더 많은 기능을 사용해 보세요.
          </p>
          <Button 
            className="w-full bg-opic-purple hover:bg-opic-purple/90"
            onClick={() => navigate('/plans')}
          >
            프리미엄으로 업그레이드
          </Button>
        </div>
        
        {/* Recent Practice */}
        <h3 className="text-sm font-medium mb-2">최근 연습</h3>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">2025-05-20</p>
              <p className="font-medium">Tell me about your daily life.</p>
            </div>
            <span className="text-yellow-500 text-xs font-medium">IM</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
