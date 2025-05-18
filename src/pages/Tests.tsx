
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Clock } from 'lucide-react';

const MOCK_TESTS = [
  { id: 1, title: 'OPIc Test 1', questions: 15, duration: '30-40 min', difficulty: 'Novice', locked: false },
  { id: 2, title: 'OPIc Test 2', questions: 15, duration: '30-40 min', difficulty: 'Intermediate Low', locked: false },
  { id: 3, title: 'OPIc Test 3', questions: 15, duration: '30-40 min', difficulty: 'Intermediate Mid', locked: false },
  { id: 4, title: 'OPIc Test 4', questions: 15, duration: '30-40 min', difficulty: 'Intermediate High', locked: true },
  { id: 5, title: 'OPIc Test 5', questions: 15, duration: '30-40 min', difficulty: 'Advanced Low', locked: true },
  { id: 6, title: 'OPIc Test 6', questions: 15, duration: '30-40 min', difficulty: 'Advanced Mid', locked: true },
  { id: 7, title: 'OPIc Test 7', questions: 15, duration: '30-40 min', difficulty: 'Advanced High', locked: true },
  { id: 8, title: 'OPIc Test 8', questions: 15, duration: '30-40 min', difficulty: 'Superior', locked: true },
  { id: 9, title: 'OPIc Test 9', questions: 15, duration: '30-40 min', difficulty: 'Mixed', locked: true },
  { id: 10, title: 'OPIc Test 10', questions: 15, duration: '30-40 min', difficulty: 'Final Review', locked: true },
];

const Tests = () => {
  const navigate = useNavigate();

  const handleTestClick = (testId: number, locked: boolean) => {
    if (locked) {
      // Show premium prompt or navigate to subscription page
      navigate('/plans');
    } else {
      // Navigate to the test
      navigate(`/test/${testId}`);
    }
  };

  return (
    <div className="pb-20">
      <Header title="OPIc Tests" />
      
      <div className="p-4">
        <p className="text-gray-600 mb-6">
          Complete full OPIc test simulations with 15 questions each. Receive detailed feedback and scoring after completion.
        </p>
        
        <div className="space-y-4">
          {MOCK_TESTS.map((test) => (
            <Card 
              key={test.id} 
              className={`shadow-sm ${test.locked ? 'opacity-70' : ''}`}
              onClick={() => handleTestClick(test.id, test.locked)}
            >
              <CardContent className="p-0">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{test.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock size={14} className="mr-1" />
                      <span>{test.duration}</span>
                      <span className="mx-2">•</span>
                      <span>{test.questions} questions</span>
                    </div>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        test.difficulty.includes('Advanced') || test.difficulty === 'Superior' 
                          ? 'bg-opic-light-purple text-opic-purple' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {test.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {test.locked && <span className="text-xs text-opic-purple mr-2">Premium</span>}
                    <ChevronRight size={20} className="text-gray-400" />
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
