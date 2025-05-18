
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';

const TemplateSelect = () => {
  const location = useLocation();
  const [level, setLevel] = useState('');
  
  useEffect(() => {
    // Extract level from URL search params if available
    const searchParams = new URLSearchParams(location.search);
    const levelParam = searchParams.get('level');
    if (levelParam) {
      setLevel(levelParam);
    } else {
      // For testing, set a default level to show the Don't Need Template option
      setLevel('intermediate');
    }
  }, [location]);

  const isIntermediateOrAdvanced = level === 'intermediate' || level === 'advanced';
  
  return (
    <div className="pb-20">
      <Header title="템플릿 선택" showBack />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-5 mb-6">
          <h2 className="text-lg font-medium mb-2">답변 템플릿을 선택하세요</h2>
          <p className="text-sm text-gray-600">Tell me about your daily life.</p>
          {level && (
            <p className="text-xs text-gray-500 mt-2">
              Current level: {level}
            </p>
          )}
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4 hover:bg-gray-50">
          <h3 className="font-medium mb-3">Basic Daily Routine</h3>
          <p className="text-sm text-gray-600 mb-1">
            In my daily life, I usually wake up at _____. The first thing 
            I do is _____. After that, I _____. In the afternoon, I 
            typically _____. My favorite part of the day is when I...
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4 opacity-50">
          <h3 className="font-medium mb-3">Detailed Schedule</h3>
          <p className="text-sm text-gray-600 mb-1">
            On weekdays, I wake up ___ and ___. My daily 
            routine is _____. When I _____... 
          </p>
          <span className="text-xs px-2 py-1 bg-opic-purple text-white rounded-full inline-block mt-2">프리미엄</span>
        </div>
        
        {isIntermediateOrAdvanced && (
          <Link 
            to="/record-answer" 
            className="block bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6 hover:bg-gray-50"
          >
            <div>
              <h3 className="font-medium mb-3">Speak Freely</h3>
              <p className="text-sm text-gray-600">
                Create your own answer without using a template. 
                Express yourself naturally and confidently.
              </p>
            </div>
          </Link>
        )}
        
        <Link 
          to="/practice-answer" 
          className="block text-center bg-opic-purple text-white py-3 px-4 rounded-lg w-full mt-6"
        >
          <div className="flex items-center justify-center">
            <span>계속하기</span>
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TemplateSelect;
