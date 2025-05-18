
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface FeedbackItem {
  category: 'grammar' | 'fluency' | 'vocabulary';
  feedback: string;
  issues?: {
    text: string;
    correction: string;
    explanation: string;
  }[];
}

interface HistoryItem {
  id: string;
  date: string;
  transcript: string;
  opicLevel: string;
  question: string;
  feedbackItems?: FeedbackItem[];
  sampleAnswer?: string;
}

const History = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
            feedbackItems: [
              {
                category: 'grammar',
                feedback: "Your grammar is mostly correct with only minor errors. Continue practicing with more complex sentence structures to improve your grammar accuracy."
              },
              {
                category: 'fluency',
                feedback: "You speak with good fluency, though there's room for more natural transitions. Try to vary your sentence structures more."
              },
              {
                category: 'vocabulary',
                feedback: "You use a good range of vocabulary appropriate for the topic. To further improve, try incorporating more advanced vocabulary."
              }
            ],
            sampleAnswer: "My daily routine starts at around 6:30 AM when I wake up. After brushing my teeth and washing my face, I usually have a light breakfast consisting of toast and a cup of coffee. I try to read the news or check my emails while eating. By 8:00 AM, I leave for work and typically arrive at the office by 8:30 AM."
          },
          {
            id: 'mock-2',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            transcript: "I love to travel. Last year, I visited Japan and it was amazing. The food was delicious and the people were very friendly. I would like to go there again.",
            opicLevel: 'IL',
            question: 'Tell me about your travel experiences.',
            feedbackItems: [
              {
                category: 'grammar',
                feedback: "Your grammar has some minor errors. Pay attention to verb tenses when describing past experiences."
              },
              {
                category: 'fluency',
                feedback: "Your response is somewhat brief. Try to elaborate more on your experiences to demonstrate better fluency."
              },
              {
                category: 'vocabulary',
                feedback: "Your vocabulary is basic but appropriate. Consider using more descriptive adjectives and specific travel terminology."
              }
            ],
            sampleAnswer: "I've been fortunate enough to travel to several countries over the past few years. One of my most memorable trips was to Japan last spring. I spent two weeks exploring Tokyo, Kyoto, and Osaka. The cultural contrast between the ultramodern cities and ancient temples was fascinating."
          },
          {
            id: 'mock-3',
            date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            transcript: "My favorite hobby is reading books. I read mostly fiction, but sometimes I also enjoy non-fiction books about history or science. Reading helps me relax and learn new things.",
            opicLevel: 'IH',
            question: 'What are your hobbies?',
            feedbackItems: [
              {
                category: 'grammar',
                feedback: "Your grammar is quite good with very few errors. Keep using varied sentence structures."
              },
              {
                category: 'fluency',
                feedback: "You express yourself clearly and with good fluency. To improve further, try connecting your ideas with more sophisticated transitions."
              },
              {
                category: 'vocabulary',
                feedback: "You demonstrate a good range of vocabulary. Continue expanding your lexicon with more specialized terms related to your interests."
              }
            ],
            sampleAnswer: "I have several hobbies that I enjoy in my free time. My main passion is photography – I particularly enjoy landscape and street photography. I spend most weekends exploring different neighborhoods or natural areas with my camera. I also enjoy cooking, especially trying recipes from different countries."
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
  
  // Map OPIc level to badge color
  const getLevelBadgeStyle = (level: string) => {
    if (level.startsWith('N')) return 'bg-gray-100 text-gray-800'; // Novice
    if (level.startsWith('I')) return 'bg-yellow-100 text-yellow-800'; // Intermediate
    if (level.startsWith('A')) return 'bg-opic-light-purple text-opic-purple'; // Advanced
    return 'bg-blue-100 text-blue-800'; // Superior or others
  };
  
  // Function to get corrected answer with highlighted changes
  const getCorrectedAnswer = (item: HistoryItem) => {
    if (!item.transcript || !item.feedbackItems) return item.transcript;
    
    let corrected = item.transcript;
    
    // Apply corrections from grammar issues if they exist
    item.feedbackItems.forEach(feedbackItem => {
      if (feedbackItem.issues && feedbackItem.issues.length > 0) {
        feedbackItem.issues.forEach(issue => {
          corrected = corrected.replace(new RegExp(issue.text, 'g'), 
            `<span class="line-through text-red-500">${issue.text}</span> <span class="text-green-600">${issue.correction}</span>`);
        });
      }
    });
    
    return corrected;
  };
  
  // Function to get background color for each category
  const getCategoryBackgroundColor = (category: string) => {
    switch (category) {
      case 'grammar':
        return 'bg-[#FEF7CD]'; // Light yellow
      case 'fluency':
        return 'bg-[#F2FCE2]'; // Light green
      case 'vocabulary':
        return 'bg-[#E5DEFF]'; // Light purple
      default:
        return 'bg-white';
    }
  };
  
  // Delete history item function
  const deleteHistoryItem = (id: string) => {
    // Remove item from state
    const updatedHistory = historyItems.filter(item => item.id !== id);
    setHistoryItems(updatedHistory);
    
    // Update localStorage
    localStorage.setItem('practiceHistory', JSON.stringify(updatedHistory));
    
    // Show toast notification
    toast({
      title: "기록이 삭제되었습니다",
      description: "연습 기록이 성공적으로 삭제되었습니다.",
    });
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
        {historyItems.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500">아직 연습 기록이 없습니다.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {historyItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <Card className="mb-3 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <AccordionTrigger className="hover:no-underline flex-1">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex justify-between w-full mb-1">
                          <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                          <Badge className={`${getLevelBadgeStyle(item.opicLevel)}`}>
                            {item.opicLevel}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm text-left">{item.question}</h3>
                      </div>
                    </AccordionTrigger>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistoryItem(item.id);
                      }}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                  
                  <AccordionContent>
                    <CardContent className="px-4 pt-1 pb-4">
                      <div className="bg-gray-50 p-3 rounded-md mb-4">
                        <h4 className="text-xs font-medium mb-1">당신의 답변</h4>
                        <p className="text-sm text-gray-700">{item.transcript}</p>
                      </div>
                      
                      <Tabs defaultValue="feedback">
                        <TabsList className="w-full grid grid-cols-3">
                          <TabsTrigger value="feedback" className="text-xs">피드백</TabsTrigger>
                          <TabsTrigger value="corrected" className="text-xs">교정된 답변</TabsTrigger>
                          <TabsTrigger value="sample" className="text-xs">샘플 답변</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="feedback" className="pt-3">
                          {item.feedbackItems?.map((feedbackItem, index) => (
                            <div key={index} className={`mb-3 p-2 rounded-md ${getCategoryBackgroundColor(feedbackItem.category)}`}>
                              <h4 className="text-xs font-medium capitalize mb-1">{feedbackItem.category}</h4>
                              <p className="text-xs text-gray-600">{feedbackItem.feedback}</p>
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="corrected" className="pt-3">
                          <h4 className="text-xs font-medium mb-1">교정된 답변</h4>
                          <div 
                            className="text-xs" 
                            dangerouslySetInnerHTML={{ __html: getCorrectedAnswer(item) }} 
                          />
                        </TabsContent>
                        
                        <TabsContent value="sample" className="pt-3">
                          <h4 className="text-xs font-medium mb-1">AI 샘플 답변</h4>
                          <p className="text-xs">{item.sampleAnswer}</p>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default History;
