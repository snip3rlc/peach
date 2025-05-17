
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ChevronRight, CreditCard, Bell, HelpCircle, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Profile = () => {
  const navigate = useNavigate();
  
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
              <span className="text-black font-medium mr-2">스타터</span>
              <button 
                className="px-3 py-1 border border-opic-purple text-opic-purple rounded text-sm font-medium"
                onClick={() => navigate('/plans')}
              >
                변경
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
          <Link to="/referral" className="p-4 flex items-center w-full text-left">
            <div className="w-8 h-8 bg-opic-light-purple rounded-lg flex items-center justify-center text-opic-purple mr-3">
              <CreditCard size={20} />
            </div>
            <span className="flex-1">친구 초대</span>
            <ChevronRight size={20} className="text-gray-400" />
          </Link>
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
          <Collapsible>
            <CollapsibleTrigger className="p-4 flex items-center w-full text-left">
              <div className="w-8 h-8 bg-opic-light-purple rounded-lg flex items-center justify-center text-opic-purple mr-3">
                <HelpCircle size={20} />
              </div>
              <span className="flex-1">자주 묻는 질문</span>
              <ChevronRight size={20} className="text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-1">
              <div className="border-t border-gray-100 pt-3">
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1">OPIc 시험은 어떻게 준비해야 하나요?</h4>
                  <p className="text-xs text-gray-600">꾸준한 연습과 다양한 주제에 대한 답변 연습이 가장 중요합니다.</p>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1">레벨은 어떻게 선택하나요?</h4>
                  <p className="text-xs text-gray-600">자신의 영어 실력에 맞는 레벨을 선택하시면 됩니다. 시작은 낮은 레벨부터 점차 높여가는 것을 추천합니다.</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">녹음한 답변을 다시 들을 수 있나요?</h4>
                  <p className="text-xs text-gray-600">네, 히스토리에서 과거 연습 기록을 확인하실 수 있습니다.</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible>
            <CollapsibleTrigger className="p-4 flex items-center w-full text-left border-t border-gray-100">
              <div className="w-8 h-8 bg-opic-light-purple rounded-lg flex items-center justify-center text-opic-purple mr-3">
                <HelpCircle size={20} />
              </div>
              <span className="flex-1">앱 정보</span>
              <ChevronRight size={20} className="text-gray-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-1">
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-600">버전: 1.0.1</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
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
