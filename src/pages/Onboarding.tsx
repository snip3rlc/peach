
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
      title: "OPIc 마스터로 연습하세요",
      description: "실제 시험과 같은 환경에서 OPIc 시험 준비를 시작해보세요."
    },
    {
      icon: <MessageCircle size={64} className="text-opic-purple mb-6" />,
      title: "AI 맞춤형 피드백",
      description: "AI가 당신의 답변을 분석하고 맞춤형 피드백을 제공합니다."
    },
    {
      icon: <Award size={64} className="text-opic-purple mb-6" />,
      title: "점수 향상 보장",
      description: "꾸준한 연습으로 자신감을 키우고 OPIc 점수를 향상시켜보세요."
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
  
  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    navigate('/signin');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          {slides[currentSlide].icon}
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
        <Button 
          onClick={handleNext}
          className="w-full bg-opic-purple hover:bg-opic-purple/90 mb-4"
        >
          {currentSlide === slides.length - 1 ? '시작하기' : '다음'}
        </Button>
        
        {currentSlide < slides.length - 1 && (
          <button 
            onClick={handleSkip}
            className="text-gray-500 text-sm w-full text-center"
          >
            건너뛰기
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
