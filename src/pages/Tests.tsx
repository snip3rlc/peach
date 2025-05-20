
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight } from 'lucide-react';

// Sample OPIc tests structure
const tests = [
  {
    id: 1,
    name: "OPIc Practice Test 1",
    completed: false,
    date: null
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
  const [testsList, setTestsList] = useState(tests);
  
  // Load tests from localStorage if available
  useEffect(() => {
    const storedTests = localStorage.getItem('opicTests');
    if (storedTests) {
      try {
        const parsedTests = JSON.parse(storedTests);
        setTestsList(parsedTests);
      } catch (error) {
        console.error('Error parsing tests from localStorage:', error);
      }
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
          <h2 className="text-lg font-medium mb-2">OPIc 모의고사</h2>
          <p className="text-sm text-gray-600">
            15개의 질문으로 구성된 OPIc 모의고사로 실전 감각을 키워보세요. 
            테스트 후 자세한 피드백을 받을 수 있습니다.
          </p>
        </div>
        
        <div className="space-y-4">
          {testsList.map((test) => (
            <Link 
              key={test.id}
              to={test.completed ? `/test/${test.id}/results` : `/test/${test.id}`}
              className="block"
            >
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      {test.completed && test.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Completed on {formatDate(test.date)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      {test.completed ? (
                        <CheckCircle className="text-green-500 mr-2" size={20} />
                      ) : (
                        <Button 
                          variant="outline" 
                          className="text-xs px-3 py-1 h-auto border-opic-purple text-opic-purple mr-2"
                        >
                          Start
                        </Button>
                      )}
                      <ChevronRight className="text-gray-400" size={20} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tests;
