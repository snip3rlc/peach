
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const slides = [
    {
      icon: <BookOpen size={64} className="text-opic-purple mb-6" />,
      title: "진짜 시험처럼 연습해요",
      description: "실제 OPIc 시험과 동일한 환경에서 부담 없이 연습할 수 있어요."
    },
    {
      icon: <MessageCircle size={64} className="text-opic-purple mb-6" />,
      title: "AI가 도와드려요",
      description: "내 말하기를 분석해서 어떻게 하면 더 자연스러운지 알려줘요."
    },
    {
      icon: <Award size={64} className="text-opic-purple mb-6" />,
      title: "실력이 쑥쑥 늘어요",
      description: "꾸준히 연습하면 자신감이 생기고 OPIc 점수도 올라가요!"
    }
  ];
  
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('hasSeenOnboarding', 'true');
      navigate('/signin');
    }
  };
  
  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    navigate('/signin');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip button in top right corner */}
      <div className="absolute top-6 right-6 z-10">
        {currentSlide < slides.length - 1 && (
          <button 
            onClick={handleSkip}
            className="text-gray-500 text-sm"
          >
            건너뛰기
          </button>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            {slides[currentSlide].icon}
          </div>
          <h1 className="text-2xl font-bold mb-4">{slides[currentSlide].title}</h1>
          <p className="text-gray-600 mb-8">{slides[currentSlide].description}</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-opic-purple' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6 pb-10">
        <div className="flex gap-2">
          {currentSlide > 0 && (
            <Button 
              onClick={handleBack}
              variant="outline"
              className="flex-1 max-w-[25%]"
            >
              뒤로
            </Button>
          )}
          <Button 
            onClick={handleNext}
            className={`bg-opic-purple hover:bg-opic-purple/90 ${currentSlide > 0 ? 'flex-[3]' : 'w-full'}`}
          >
            {currentSlide === slides.length - 1 ? '시작하기' : '다음'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
