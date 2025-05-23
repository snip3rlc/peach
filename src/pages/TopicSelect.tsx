
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Coffee, Building, Heart, Utensils, Plane, Film, BookOpen, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TopicData {
  topic: string;
  count: number;
}

const TopicSelect = () => {
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const level = queryParams.get('level') || 'intermediate';

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        console.log('Fetching topics for level:', level);
        
        // Get distinct topics for the selected level
        const { data: distinctTopics, error: distinctError } = await supabase
          .from('questions')
          .select('topic')
          .eq('level', level)
          .not('topic', 'is', null);
        
        if (distinctError) throw distinctError;
        
        console.log('Raw topics data:', distinctTopics);
        
        if (!distinctTopics || distinctTopics.length === 0) {
          console.warn('No topics found for level:', level);
          setTopics([]);
          setIsLoading(false);
          return;
        }
        
        // Filter and deduplicate topics
        const validTopics = new Set<string>();
        
        distinctTopics.forEach(item => {
          const topic = item.topic?.trim();
          
          // Skip invalid topic names
          if (!topic || typeof topic !== 'string') return;
          
          const invalidPatterns = [
            /^question\s*\d+$/i,
            /^no$/i,
            /^yes$/i,
            /^survey$/i,
            /^random$/i,
            /^template$/i,
            /^source$/i,
            /^type$/i,
            /^level$/i,
            /^\s*$/,
            /^\d+$/,
            /^[a-z]\d*$/i // Single letter optionally followed by numbers
          ];
          
          if (!invalidPatterns.some(pattern => pattern.test(topic))) {
            validTopics.add(topic);
          }
        });
        
        // Now get count of questions for each valid topic
        const topicsWithCount: TopicData[] = [];
        
        for (const topic of validTopics) {
          const { data: countData, error: countError } = await supabase
            .from('questions')
            .select('id', { count: 'exact' })
            .eq('level', level)
            .eq('topic', topic);
          
          if (countError) {
            console.error('Error fetching count for topic:', topic, countError);
            continue;
          }
          
          const count = countData?.length || 0;
          topicsWithCount.push({ topic, count });
        }
        
        console.log('Filtered unique topics with counts:', topicsWithCount);
        
        if (topicsWithCount.length === 0) {
          console.warn('No valid topics found, using fallback topics');
          // Fallback to common topics if no valid topics found
          const fallbackTopics = [
            '일상생활', '직장/학교', '건강/웰빙', '음식/요리', 
            '여행/관광', '취미/여가', '교육', '사회생활'
          ];
          setTopics(fallbackTopics.map(topic => ({ topic, count: 0 })));
        } else {
          // Sort topics alphabetically
          setTopics(topicsWithCount.sort((a, b) => a.topic.localeCompare(b.topic)));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching topics:', error);
        setIsLoading(false);
      }
    };
    
    fetchTopics();
  }, [level]);

  // Map topic names to icons
  const getTopicIcon = (topic: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      '일상생활': <Coffee size={16} />,
      '직장/학교': <Building size={16} />,
      '건강/웰빙': <Heart size={16} />,
      '음식/요리': <Utensils size={16} />,
      '여행/관광': <Plane size={16} />,
      '취미/여가': <Film size={16} />,
      '교육': <BookOpen size={16} />,
      '사회생활': <Users size={16} />
    };
    
    return iconMap[topic] || <Coffee size={16} />;
  };
  
  // Map topic names to background colors
  const getTopicColor = (topic: string) => {
    const colorMap: { [key: string]: string } = {
      '일상생활': 'bg-blue-100 text-blue-500',
      '직장/학교': 'bg-green-100 text-green-500',
      '건강/웰빙': 'bg-red-100 text-red-500',
      '음식/요리': 'bg-yellow-100 text-yellow-500',
      '여행/관광': 'bg-purple-100 text-purple-500',
      '취미/여가': 'bg-opic-light-purple text-opic-purple',
      '교육': 'bg-pink-100 text-pink-500',
      '사회생활': 'bg-orange-100 text-orange-500'
    };
    
    return colorMap[topic] || 'bg-blue-100 text-blue-500';
  };

  return (
    <div className="pb-20">
      <Header title="Topic" showBack />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-5 mb-6">
          <h2 className="text-lg font-medium mb-2">연습할 주제를 선택하세요</h2>
          <p className="text-sm text-gray-600">
            여러 주제 중에서 연습하고 싶은 주제를 선택하면 관련 문항이 제공됩니다.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Level: {level}
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p>Loading topics...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No topics found for this level.</p>
            <p className="text-sm text-gray-400">Please upload question data or check the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {topics.map((topicData, index) => (
              <Link 
                key={index} 
                to={`/questions?level=${level}&topic=${encodeURIComponent(topicData.topic)}`}
                className="block bg-white rounded-lg border border-gray-100 shadow-sm p-2.5"
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTopicColor(topicData.topic)}`}>
                    {getTopicIcon(topicData.topic)}
                  </div>
                  <div className="ml-2">
                    <h3 className="font-medium text-sm">{topicData.topic}</h3>
                    <p className="text-xs text-gray-500">{topicData.count} questions</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicSelect;
