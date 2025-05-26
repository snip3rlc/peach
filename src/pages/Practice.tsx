
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Practice = () => {
  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset">
      <Header title="연습하기" showBack={false} />
      
      <div className="px-4 pt-4 pb-24 space-y-6">
        <div className="bg-opic-light-purple rounded-lg p-5">
          <h2 className="text-lg font-medium mb-2">연습할 레벨을 선택하세요</h2>
        </div>
        
        <div className="space-y-6">
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
