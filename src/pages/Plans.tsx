
import React, { useState } from 'react';
import Header from '../components/Header';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Plans = () => {
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset">
      <Header title="구독 플랜" />
      
      <div className="px-4 pt-4 pb-24 space-y-6">
        <div className="bg-opic-light-purple rounded-lg p-5">
          <h2 className="text-lg font-medium mb-2">구독 플랜 선택</h2>
          <p className="text-sm text-gray-600">
            자신에게 맞는 플랜을 선택하여 OPIc 시험을 준비하세요.
            현재 신규 사용자는 7일 무료 체험이 가능합니다!
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Starter Plan */}
          <div 
            className={`bg-white rounded-lg border shadow-sm ${
              expandedPlan === "starter" ? "border-green-500" : "border-gray-100"
            }`}
          >
            <div 
              className={`p-4 flex justify-between items-center ${
                expandedPlan === "starter" ? "border-b border-gray-100" : ""
              }`}
              onClick={() => setExpandedPlan(expandedPlan === "starter" ? null : "starter")}
            >
              <div className="flex-1">
                <h3 className="font-medium text-black flex items-center justify-between">
                  스타터 
                  <div className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] font-medium ml-1">현재 구독 중</div>
                </h3>
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
          
          {/* Silver Plan */}
          <div 
            className={`bg-white rounded-lg border shadow-sm ${
              expandedPlan === "silver" ? "border-opic-purple" : "border-gray-100"
            }`}
          >
            <div 
              className={`p-4 flex justify-between items-center ${
                expandedPlan === "silver" ? "border-b border-gray-100" : ""
              }`}
              onClick={() => setExpandedPlan(expandedPlan === "silver" ? null : "silver")}
            >
              <div className="flex-1">
                <h3 className="font-medium flex items-center justify-between">
                  실버 플랜
                  <div className="inline-block px-2 py-0.5 bg-opic-light-purple text-opic-purple rounded-full text-[10px] font-medium ml-1">인기</div>
                </h3>
                <p className="text-opic-purple font-medium">₩4,500 /월</p>
              </div>
              <svg className={`w-5 h-5 text-gray-500 transform ${expandedPlan === "silver" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedPlan === "silver" && (
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
                
                <Button 
                  className="w-full mt-4"
                  onClick={() => window.location.href = "/signin?redirect=subscribe&plan=silver"}
                >
                  업그레이드
                </Button>
              </div>
            )}
          </div>
          
          {/* Gold Plan */}
          <div 
            className={`bg-white rounded-lg border shadow-sm ${
              expandedPlan === "gold" ? "border-opic-purple" : "border-gray-100"
            }`}
          >
            <div 
              className={`p-4 flex justify-between items-center ${
                expandedPlan === "gold" ? "border-b border-gray-100" : ""
              }`}
              onClick={() => setExpandedPlan(expandedPlan === "gold" ? null : "gold")}
            >
              <div>
                <h3 className="font-medium">골드 플랜</h3>
                <p className="text-opic-purple font-medium">₩9,000 /월</p>
              </div>
              <svg className={`w-5 h-5 text-gray-500 transform ${expandedPlan === "gold" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedPlan === "gold" && (
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
                
                <Button 
                  className="w-full mt-4"
                  onClick={() => window.location.href = "/signin?redirect=subscribe&plan=gold"}
                >
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
