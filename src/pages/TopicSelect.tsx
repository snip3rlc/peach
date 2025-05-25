
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Badge } from '@/components/ui/badge';
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
        
        // Filter and deduplicate topics - be more strict about filtering
        const validTopics = new Set<string>();
        
        distinctTopics.forEach(item => {
          const topic = item.topic?.trim();
          
          // Skip invalid topic names
          if (!topic || typeof topic !== 'string') return;
          
          const invalidPatterns = [
            /^question\s*\d*$/i,
            /^no$/i,
            /^yes$/i,
            /^survey\s*\/?\s*random$/i,
            /^template$/i,
            /^source$/i,
            /^type$/i,
            /^level$/i,
            /^topic$/i,
            /^\s*$/,
            /^\d+$/,
            /^[a-z]\d*$/i,
            /^question$/i,
            /^random$/i,
            /^survey$/i
          ];
          
          // Only add topics that are meaningful (longer than 2 characters and not in invalid patterns)
          if (topic.length > 2 && !invalidPatterns.some(pattern => pattern.test(topic))) {
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
          if (count > 0) { // Only include topics that have questions
            topicsWithCount.push({ topic, count });
          }
        }
        
        console.log('Filtered unique topics with counts:', topicsWithCount);
        
        if (topicsWithCount.length === 0) {
          console.warn('No valid topics found, using fallback topics');
          // Fallback to common topics if no valid topics found
          const fallbackTopics = [
            'Appointments', 'Technology', 'Internet', 'Phone', 'Travel', 
            'Food', 'Health', 'Education', 'Work', 'Shopping'
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

  // Format level label for display
  const formatLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="pb-20 font-sans">
      <Header title="연습 주제" showBack />
      
      <div className="p-4">
        <div className="bg-purple-50 rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-semibold mb-2">연습할 주제를 선택하세요</h2>
          <div className="mt-3">
            <Badge className="bg-white border border-gray-200 text-gray-700 text-xs rounded-full font-medium">
              {formatLevel(level)}
            </Badge>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-gray-500">Loading topics...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No topics found for this level.</p>
            <p className="text-sm text-gray-400">Please upload question data or check the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {topics.map((topicData, index) => (
              <Link 
                key={index} 
                to={`/questions?level=${level}&topic=${encodeURIComponent(topicData.topic)}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-3 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] h-20 flex flex-col justify-between"
              >
                <div className="text-center flex-1 flex items-center justify-center">
                  <h3 className="text-sm text-gray-900 leading-tight text-center">
                    {topicData.topic}
                  </h3>
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-500 font-medium">
                    {topicData.count}
                  </span>
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
