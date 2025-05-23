
import React from 'react';
import Header from '../components/Header';
import DailyTrivia from '../components/DailyTrivia';
import ProgressBar from '../components/ProgressBar';
import TipsCarousel from '../components/TipsCarousel';
import DidYouKnow from '../components/DidYouKnow';
import UpgradeCard from '../components/UpgradeCard';

const Dashboard = () => {
  const triviaData = {
    question: "다음 중 'hobby'를 설명하는 표현으로 가장 적절한 것은?",
    options: [
      { text: "Something I do for work", isCorrect: false },
      { text: "Something I enjoy in my free time", isCorrect: true },
      { text: "Something I have to do", isCorrect: false },
      { text: "Something very expensive", isCorrect: false }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset">
      <Header title="홈" />
      
      <div className="px-4 pt-4 pb-24 space-y-6">
        <DailyTrivia 
          question={triviaData.question}
          options={triviaData.options}
        />
        
        <ProgressBar />
        
        <TipsCarousel />
        
        <DidYouKnow />
        
        <UpgradeCard />
      </div>
    </div>
  );
};

export default Dashboard;
