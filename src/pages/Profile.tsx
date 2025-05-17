
import React from 'react';
import Header from '../components/Header';
import { ChevronRight, CreditCard, Bell, HelpCircle, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Profile = () => {
  return (
    <div className="pb-20">
      <Header title="프로필" />
      
      <div className="p-4">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-opic-light-purple text-opic-purple rounded-full flex items-center justify-center text-xl font-medium">
              게스
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-medium mb-1 flex items-center">
                게스트 사용자
                <ChevronRight size={20} className="ml-1 text-gray-400" />
              </h2>
              <p className="text-gray-500 text-sm">guest@example.com</p>
              <p className="text-gray-500 text-sm">가입일: 2025년 5월 17일</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
          <h3 className="font-medium mb-4">구독 정보</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-700">현재 플랜</p>
            <div className="flex items-center">
              <span className="text-opic-purple font-medium mr-2">스타터</span>
              <button className="px-3 py-1 border border-opic-purple text-opic-purple rounded text-sm font-medium">
                변경
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
          <button className="p-4 flex items-center w-full text-left">
            <div className="w-8 h-8 bg-opic-light-purple rounded-lg flex items-center justify-center text-opic-purple mr-3">
              <CreditCard size={20} />
            </div>
            <span className="flex-1">친구 초대</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-opic-light-purple rounded-lg flex items-center justify-center text-opic-purple mr-3">
                <Bell size={20} />
              </div>
              <span>알림</span>
            </div>
            <Switch />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
          <button className="p-4 flex items-center w-full text-left">
            <div className="w-8 h-8 bg-opic-light-purple rounded-lg flex items-center justify-center text-opic-purple mr-3">
              <HelpCircle size={20} />
            </div>
            <span className="flex-1">자주 묻는 질문</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          
          <button className="p-4 flex items-center w-full text-left border-t border-gray-100">
            <div className="w-8 h-8 bg-opic-light-purple rounded-lg flex items-center justify-center text-opic-purple mr-3">
              <HelpCircle size={20} />
            </div>
            <span className="flex-1">앱 정보</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
        
        <button className="w-full p-4 text-center text-red-500 flex items-center justify-center">
          <LogOut size={20} className="mr-2" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
