
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Coffee, Building, Heart, Utensils, Plane, Film, BookOpen, Users } from 'lucide-react';

const TopicSelect = () => {
  return (
    <div className="pb-20">
      <Header title="주제 선택" showBack />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-5 mb-6">
          <h2 className="text-lg font-medium mb-2">연습할 주제를 선택하세요</h2>
          <p className="text-sm text-gray-600">
            여러 주제 중에서 연습하고 싶은 주제를 선택하면 관련 문항이 제공됩니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <Link to="/questions" className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                <Coffee size={22} />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">일상생활</h3>
              </div>
            </div>
          </Link>
          
          <Link to="/questions" className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-500">
                <Building size={22} />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">직장/학교</h3>
              </div>
            </div>
          </Link>
          
          <Link to="/questions" className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-500">
                <Heart size={22} />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">건강/웰빙</h3>
              </div>
            </div>
          </Link>
          
          <Link to="/questions" className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-500">
                <Utensils size={22} />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">음식/요리</h3>
              </div>
            </div>
          </Link>
          
          <Link to="/questions" className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500">
                <Plane size={22} />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">여행/관광</h3>
              </div>
            </div>
          </Link>
          
          <Link to="/questions" className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-opic-light-purple flex items-center justify-center text-opic-purple">
                <Film size={22} />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">취미/여가</h3>
              </div>
            </div>
          </Link>
          
          <Link to="/questions" className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-500">
                <BookOpen size={22} />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">교육</h3>
              </div>
            </div>
          </Link>
          
          <Link to="/questions" className="block bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                <Users size={22} />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">사회생활</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopicSelect;
