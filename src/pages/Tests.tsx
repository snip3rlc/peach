
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Sample OPIc tests structure with mock completed data
const mockTests = [
  {
    id: 1,
    name: "OPIc Practice Test 1",
    completed: true,
    date: "2025-05-19T15:30:00.000Z"
  },
  {
    id: 2,
    name: "OPIc Practice Test 2",
    completed: false,
    date: null
  },
  {
    id: 3,
    name: "OPIc Practice Test 3",
    completed: false,
    date: null
  }
];

const Tests = () => {
  const navigate = useNavigate();
  const [testsList, setTestsList] = useState(mockTests);
  
  // Load tests from localStorage if available
  useEffect(() => {
    const storedTests = localStorage.getItem('opicTests');
    if (storedTests) {
      try {
        const parsedTests = JSON.parse(storedTests);
        setTestsList(parsedTests);
      } catch (error) {
        console.error('Error parsing tests from localStorage:', error);
        // If there's an error parsing, use the mock data
        setTestsList(mockTests);
      }
    } else {
      // If no stored data, initialize localStorage with mock data
      localStorage.setItem('opicTests', JSON.stringify(mockTests));
      setTestsList(mockTests);
    }
  }, []);
  
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="pb-20">
      <Header title="Tests" showBack />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-5 mb-6">
          <h2 className="text-lg font-medium mb-2">OPIc Practice</h2>
          <p className="text-sm text-gray-600">
            15개의 질문으로 구성된 OPIc 모의고사로 실전 감각을 키워보세요. 
            테스트 후 자세한 피드백을 받을 수 있습니다.
          </p>
        </div>
        
        <div className="space-y-4">
          {testsList.map((test) => (
            <Card key={test.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {test.completed && (
                      <CheckCircle className="text-green-500 mr-1 flex-shrink-0" size={18} />
                    )}
                    <div>
                      <h3 className="font-medium text-xs">{test.name}</h3>
                      {test.completed && test.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Completed on {formatDate(test.date)}
                        </p>
                      )}
                      {test.completed && (
                        <Link 
                          to={`/test/${test.id}/results`}
                          className="text-xs text-opic-purple font-medium block mt-1"
                        >
                          See Results
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Link to={`/test/${test.id}`}>
                      <Button 
                        variant="outline" 
                        className="text-xs px-3 py-1 h-auto border-opic-purple text-opic-purple mr-2"
                      >
                        {test.completed ? "Try Again" : "Start"}
                      </Button>
                    </Link>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tests;
