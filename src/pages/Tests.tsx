import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestData {
  id: number;
  name: string;
  completed: boolean;
  date: string | null;
  questionCount: number;
}

const Tests = () => {
  const navigate = useNavigate();
  const [testsList, setTestsList] = useState<TestData[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load tests from Supabase and localStorage completion status
  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      
      // Fetch available tests from Supabase
      const { data: testsData, error } = await supabase
        .from('opic_tests')
        .select('test_number, question_text')
        .order('test_number', { ascending: true })
        .order('question_number', { ascending: true });

      if (error) {
        console.error('Error fetching tests:', error);
        // Fallback to mock data if database fetch fails
        loadMockTests();
        return;
      }

      if (!testsData || testsData.length === 0) {
        // No tests in database, show mock data
        loadMockTests();
        return;
      }

      // Group tests by test_number
      const groupedTests: { [key: number]: any[] } = {};
      testsData.forEach(test => {
        if (!groupedTests[test.test_number]) {
          groupedTests[test.test_number] = [];
        }
        groupedTests[test.test_number].push(test);
      });

      // Load completion status from localStorage
      const storedTests = localStorage.getItem('opicTests');
      let completionStatus: { [key: number]: { completed: boolean; date: string | null } } = {};
      
      if (storedTests) {
        try {
          const parsedTests = JSON.parse(storedTests);
          parsedTests.forEach((test: any) => {
            completionStatus[test.id] = {
              completed: test.completed,
              date: test.date
            };
          });
        } catch (error) {
          console.error('Error parsing stored tests:', error);
        }
      }

      // Create tests list from database data
      const tests: TestData[] = Object.keys(groupedTests)
        .map(testNumberStr => {
          const testNumber = parseInt(testNumberStr);
          const questions = groupedTests[testNumber];
          const status = completionStatus[testNumber] || { completed: false, date: null };
          
          return {
            id: testNumber,
            name: `Practice Test ${testNumber}`,
            completed: status.completed,
            date: status.date,
            questionCount: questions.length
          };
        })
        .sort((a, b) => a.id - b.id);

      setTestsList(tests);
    } catch (error) {
      console.error('Error loading tests:', error);
      loadMockTests();
    } finally {
      setLoading(false);
    }
  };

  const loadMockTests = () => {
    // Fallback mock data
    const mockTests = [
      { id: 1, name: "Practice Test 1", completed: true, date: "2025-05-19T15:30:00.000Z", questionCount: 15 },
      { id: 2, name: "Practice Test 2", completed: false, date: null, questionCount: 15 },
      { id: 3, name: "Practice Test 3", completed: false, date: null, questionCount: 15 }
    ];

    const storedTests = localStorage.getItem('opicTests');
    if (storedTests) {
      try {
        const parsedTests = JSON.parse(storedTests);
        setTestsList(parsedTests.map((test: any) => ({
          ...test,
          name: `Practice Test ${test.id}`,
          questionCount: 15
        })));
      } catch (error) {
        console.error('Error parsing tests from localStorage:', error);
        setTestsList(mockTests);
      }
    } else {
      localStorage.setItem('opicTests', JSON.stringify(mockTests));
      setTestsList(mockTests);
    }
  };
  
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="pb-20">
        <Header title="모의고사" showBack={false} />
        <div className="p-4 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Header title="모의고사" showBack={false} />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-5 mb-6">
          <h2 className="text-base font-medium mb-1">OPIc Practice</h2>
          <p className="text-xs text-gray-600">
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
                    <div>
                      <h3 className="font-medium text-xs flex items-center gap-2">
                        {test.completed && (
                          <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                        )}
                        {test.name}
                      </h3>
                      {test.completed && test.date && (
                        <>
                          <p className="text-xs text-gray-500 mt-1">
                            Completed on {formatDate(test.date)}
                          </p>
                          <Link 
                            to={`/test/${test.id}/results`}
                            className="text-xs text-opic-purple font-medium block mt-1"
                          >
                            See Results
                          </Link>
                        </>
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

        {testsList.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No tests available</p>
            <Button onClick={() => setShowUploader(true)} className="bg-opic-purple">
              Upload Excel File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tests;
