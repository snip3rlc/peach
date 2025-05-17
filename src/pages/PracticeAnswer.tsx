
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PracticeAnswer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    time: '',
    activity: '',
    reason: '',
  });
  const [completedAnswer, setCompletedAnswer] = useState('');

  useEffect(() => {
    const answer = `In my daily life, I usually wake up at ${formData.time || '___'}. The first thing I do is ${formData.activity || '___'}. After that, I ${formData.activity || '___'}. In the afternoon, I typically ${formData.activity || '___'}. My favorite part of the day is when I ${formData.activity || '___'} because ${formData.reason || '___'}.`;
    
    setCompletedAnswer(answer);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    navigate('/record-answer');
  };

  const handleSaveTemplate = () => {
    // Save template logic would go here
  };

  return (
    <div className="pb-20">
      <Header title="답변 작성" showBack />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-4 mb-6">
          <h2 className="font-medium">질문</h2>
          <p className="mt-1">Tell me about your daily life.</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">템플릿 채우기</h3>
            <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">time:</label>
              <Input
                type="text"
                name="time"
                placeholder="Enter your time..."
                value={formData.time}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">activity:</label>
              <Input
                type="text"
                name="activity"
                placeholder="Enter your activity..."
                value={formData.activity}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">reason:</label>
              <Input
                type="text"
                name="reason"
                placeholder="Enter your reason..."
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
          <h3 className="font-medium mb-3">완성된 답변</h3>
          <p className="text-sm text-gray-700">{completedAnswer}</p>
        </div>
        
        <Button
          onClick={handleSaveTemplate}
          variant="outline"
          className="w-full mb-4 border-opic-purple text-opic-purple hover:bg-opic-light-purple"
        >
          저장 답변 검토하기
        </Button>
        
        <Button
          onClick={handleSubmit}
          className="w-full bg-opic-purple hover:bg-opic-dark-purple"
        >
          녹음 시작하기
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default PracticeAnswer;
