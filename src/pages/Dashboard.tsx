
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

  const tipsData = [
    {
      type: "grammar" as const,
      title: "Present Perfect 활용법",
      content: "I have lived here for 5 years. (지금도 여기 살고 있음을 강조)"
    },
    {
      type: "vocabulary" as const,
      title: "일상 표현",
      content: "'I'm running late' - 늦을 것 같다는 의미로 자주 사용되는 표현"
    },
    {
      type: "pronunciation" as const,
      title: "발음 팁",
      content: "'th' 소리는 혀끝을 이 사이에 살짝 넣고 발음하세요"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset">
      <Header title="홈" />
      
      <div className="px-4 pt-4 pb-24 space-y-6">
        <DailyTrivia 
          question={triviaData.question}
          options={triviaData.options}
        />
        
        <ProgressBar progress={65} />
        
        <TipsCarousel tips={tipsData} />
        
        <DidYouKnow 
          question="영어에서 'break a leg'는 무슨 뜻일까요?"
          answer="'행운을 빈다'는 뜻입니다! 특히 공연이나 시험 전에 사용하는 격려 표현으로, 직역하면 '다리를 부러뜨려라'이지만 실제로는 '잘해라, 성공해라'라는 의미입니다."
          type="culture"
        />
        
        <UpgradeCard />
      </div>
    </div>
  );
};

export default Dashboard;
