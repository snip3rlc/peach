
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProgressBar from '../components/ProgressBar';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryItem {
  id: string; // Generate unique ID
  date: string;
  transcript: string;
  opicLevel: string;
  question: string;
  scores: {
    grammar: number;
    fluency: number;
    vocabulary: number;
  };
}

const History = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isPremium, setIsPremium] = useState(true); // For demonstration, set to true to show history

  useEffect(() => {
    // Check if user has premium access (for demonstration, we'll set to true)
    // In a real app, this would check user subscription status
    setIsPremium(true);
    
    // Get practice history from localStorage
    try {
      const storedHistory = localStorage.getItem('practiceHistory');
      
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        
        // Add IDs to history items if they don't have them
        const historyWithIds = parsedHistory.map((item: any, index: number) => ({
          ...item,
          id: item.id || `history-${Date.now()}-${index}`
        }));
        
        setHistoryItems(historyWithIds);
      } else {
        // For demonstration, add mock data if no history exists
        const mockHistory: HistoryItem[] = [
          {
            id: 'mock-1',
            date: new Date().toISOString(),
            transcript: "In my daily life, I usually wake up at 7 AM. I start my day with a cup of coffee and checking my emails. I work from 9 AM to 6 PM. After work, I like to go for a walk or exercise.",
            opicLevel: 'IM',
            question: 'Tell me about your daily life.',
            scores: {
              grammar: 85,
              fluency: 75, 
              vocabulary: 82
            }
          },
          {
            id: 'mock-2',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            transcript: "I love to travel. Last year, I visited Japan and it was amazing. The food was delicious and the people were very friendly. I would like to go there again.",
            opicLevel: 'IL',
            question: 'Tell me about your travel experiences.',
            scores: {
              grammar: 70,
              fluency: 65,
              vocabulary: 75
            }
          },
          {
            id: 'mock-3',
            date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            transcript: "My favorite hobby is reading books. I read mostly fiction, but sometimes I also enjoy non-fiction books about history or science. Reading helps me relax and learn new things.",
            opicLevel: 'IH',
            question: 'What are your hobbies?',
            scores: {
              grammar: 90,
              fluency: 85,
              vocabulary: 88
            }
          }
        ];
        
        setHistoryItems(mockHistory);
        
        // Store mock data in localStorage for future use
        localStorage.setItem('practiceHistory', JSON.stringify(mockHistory));
      }
    } catch (error) {
      console.error('Error loading practice history:', error);
    }
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'yyyy-MM-dd');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Function to get average score
  const getAverageScore = (scores: any) => {
    const values = Object.values(scores) as number[];
    return values.reduce((sum, score) => sum + score, 0) / values.length;
  };
  
  // Map OPIc level to badge color
  const getLevelBadgeStyle = (level: string) => {
    if (level.startsWith('N')) return 'bg-gray-100 text-gray-800'; // Novice
    if (level.startsWith('I')) return 'bg-yellow-100 text-yellow-800'; // Intermediate
    if (level.startsWith('A')) return 'bg-opic-light-purple text-opic-purple'; // Advanced
    return 'bg-blue-100 text-blue-800'; // Superior or others
  };

  if (!isPremium) {
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
            onClick={() => navigate('/plans')} 
            className="bg-opic-purple hover:bg-opic-dark-purple"
          >
            구독 업그레이드
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Header title="기록" />
      
      <div className="p-4">
        <h2 className="font-medium mb-4">연습 기록</h2>
        
        {historyItems.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500">아직 연습 기록이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historyItems.map((item) => (
              <Card key={item.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <Badge className={getLevelBadgeStyle(item.opicLevel)}>
                      {item.opicLevel}
                    </Badge>
                  </div>
                  
                  <h3 className="font-medium mb-3">{item.question}</h3>
                  
                  <div className="text-sm text-gray-700 line-clamp-2 mb-4">
                    {item.transcript}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center text-xs">
                        <span>Grammar</span>
                        <span>{item.scores.grammar}/100</span>
                      </div>
                      <ProgressBar progress={item.scores.grammar} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center text-xs">
                        <span>Fluency</span>
                        <span>{item.scores.fluency}/100</span>
                      </div>
                      <ProgressBar progress={item.scores.fluency} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center text-xs">
                        <span>Vocabulary</span>
                        <span>{item.scores.vocabulary}/100</span>
                      </div>
                      <ProgressBar progress={item.scores.vocabulary} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
