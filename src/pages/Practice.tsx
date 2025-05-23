
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import ExcelQuestionUploader from '@/components/ExcelQuestionUploader';

const Practice = () => {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset">
      <Header title="연습하기">
        <Button
          onClick={() => setShowUploader(!showUploader)}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
        >
          <Upload size={16} />
          Upload
        </Button>
      </Header>
      
      <div className="px-4 pt-4 pb-24 space-y-6">
        {showUploader && (
          <div className="mb-6">
            <ExcelQuestionUploader />
          </div>
        )}

        <div className="bg-opic-light-purple rounded-lg p-5">
          <h2 className="text-lg font-medium mb-2">연습할 레벨을 선택하세요</h2>
          <p className="text-sm text-gray-600">
            현재 영어 실력에 맞는 레벨을 선택하면 적합한 연습 문제와 템플릿을 제공해 드립니다.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/topics?level=intermediate">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">Intermediate</h3>
                <p className="text-sm text-gray-600">
                  다양한 주제에 대해 자세한 의견을 표현할 수 있는 단계
                </p>
              </div>
            </div>
          </Link>
          
          <Link to="/topics?level=advanced">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">Advanced</h3>
                <p className="text-sm text-gray-600">
                  복잡한 주제에 대해 유창하고 논리적으로 의견을 표현할 수 있는 단계
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Practice;
