
import React, { useState } from 'react';
import Header from '../components/Header';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Plans = () => {
  const [expandedPlan, setExpandedPlan] = useState<string | null>("starter");
  
  return (
    <div className="pb-20">
      <Header title="구독 플랜" />
      
      <div className="p-4">
        <div className="bg-opic-light-purple rounded-lg p-5 mb-6">
          <h2 className="text-lg font-medium mb-2">구독 플랜 선택</h2>
          <p className="text-sm text-gray-600">
            자신에게 맞는 플랜을 선택하여 OPIc 시험을 준비하세요.
            현재 신규 사용자는 7일 무료 체험이 가능합니다!
          </p>
        </div>
        
        <div className="mb-6">
          <div 
            className={`bg-white rounded-lg border shadow-sm mb-4 ${
              expandedPlan === "starter" ? "border-green-500" : "border-gray-100"
            }`}
          >
            <div 
              className={`p-4 flex justify-between items-center ${
                expandedPlan === "starter" ? "border-b border-gray-100" : ""
              }`}
              onClick={() => setExpandedPlan(expandedPlan === "starter" ? null : "starter")}
            >
              <div>
                <div className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mb-1">현재 구독 중</div>
                <h3 className="font-medium text-black">스타터</h3>
                <p className="text-opic-purple font-medium">무료</p>
              </div>
              <svg className={`w-5 h-5 text-gray-500 transform ${expandedPlan === "starter" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedPlan === "starter" && (
              <div className="p-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-sm">노비스 레벨 접근</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-sm">일상생활 주제만 이용 가능</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-sm">1개 템플릿 이용</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-sm">기본 피드백</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">
                  현재 플랜
                </Button>
              </div>
            )}
          </div>
          
          <div 
            className={`bg-white rounded-lg border shadow-sm mb-4 ${
              expandedPlan === "premium" ? "border-opic-purple" : "border-gray-100"
            }`}
          >
            <div 
              className={`p-4 flex justify-between items-center ${
                expandedPlan === "premium" ? "border-b border-gray-100" : ""
              }`}
              onClick={() => setExpandedPlan(expandedPlan === "premium" ? null : "premium")}
            >
              <div>
                <div className="inline-block px-2 py-1 bg-opic-light-purple text-opic-purple rounded-full text-xs font-medium mb-1">인기</div>
                <h3 className="font-medium">프리미엄</h3>
                <p className="text-opic-purple font-medium">₩5,000 /월</p>
              </div>
              <svg className={`w-5 h-5 text-gray-500 transform ${expandedPlan === "premium" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedPlan === "premium" && (
              <div className="p-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">모든 레벨 접근 가능</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">모든 주제 이용 가능</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">2개 템플릿 이용</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">상세 피드백</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">연습 히스토리 저장</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-4">
                  업그레이드
                </Button>
              </div>
            )}
          </div>
          
          <div 
            className={`bg-white rounded-lg border shadow-sm ${
              expandedPlan === "professional" ? "border-opic-purple" : "border-gray-100"
            }`}
          >
            <div 
              className={`p-4 flex justify-between items-center ${
                expandedPlan === "professional" ? "border-b border-gray-100" : ""
              }`}
              onClick={() => setExpandedPlan(expandedPlan === "professional" ? null : "professional")}
            >
              <div>
                <h3 className="font-medium">프로페셔널</h3>
                <p className="text-opic-purple font-medium">₩9,000 /월</p>
              </div>
              <svg className={`w-5 h-5 text-gray-500 transform ${expandedPlan === "professional" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedPlan === "professional" && (
              <div className="p-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">모든 레벨 접근 가능</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">모든 주제 이용 가능</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">모든 템플릿 이용 (3개)</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">상세 피드백 및 분석</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">연습 히스토리 저장</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">PDF로 내보내기</span>
                  </li>
                  <li className="flex items-center">
                    <Check size={18} className="text-opic-purple mr-2" />
                    <span className="text-sm">소셜 미디어 공유</span>
                  </li>
                </ul>
                
                <Button className="w-full mt-4">
                  업그레이드
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-xs text-center text-gray-500 mb-4">
          모든 구독은 언제든지 취소할 수 있으며, 구독 기간이 끝날 때까지 서비스를 이용할 수 있습니다.
        </p>
        <Link to="/referral" className="text-xs text-center text-opic-purple block">
          친구를 초대하면 10% 할인 혜택을 받을 수 있습니다.
        </Link>
      </div>
    </div>
  );
};

export default Plans;
