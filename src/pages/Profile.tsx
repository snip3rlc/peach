
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ChevronRight, CreditCard, Bell, HelpCircle, LogOut, Package, Edit, Camera, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthContext } from '@/App';

const Profile = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('게스트 사용자');
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState('게스트 사용자');
  const [managingSubscription, setManagingSubscription] = useState(false);
  
  const { user, subscription, loading, signOut } = useContext(AuthContext);
  
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name);
      setName(user.user_metadata.full_name);
    } else if (user?.email) {
      const emailName = user.email.split('@')[0];
      setUserName(emailName);
      setName(emailName);
    }
  }, [user]);
  
  const handleChangeName = () => {
    if (isEditingName) {
      setUserName(name);
    }
    setIsEditingName(!isEditingName);
  };
  
  const handleManageSubscription = async () => {
    if (!subscription?.active) {
      navigate('/plans');
      return;
    }
    
    try {
      setManagingSubscription(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        toast.error('구독 관리 페이지를 불러오는 중 오류가 발생했습니다.');
        console.error('Error opening customer portal:', error);
        return;
      }
      
      // Open Stripe customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      toast.error('구독 관리 페이지를 불러오는 중 오류가 발생했습니다.');
      console.error('Error:', error);
    } finally {
      setManagingSubscription(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };
  
  if (loading) {
    return (
      <div>
        <Header title="Profile" />
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="w-8 h-8 text-opic-purple animate-spin" />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Header title="Profile" />
      
      <div className="p-4">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex items-center">
            <div className="relative">
              <Avatar className="w-16 h-16 bg-opic-light-purple text-opic-purple">
                <AvatarFallback className="text-xl font-medium">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-opic-purple rounded-full flex items-center justify-center text-white">
                <Camera size={14} />
              </button>
            </div>
            <div className="ml-4 flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="text-lg font-medium"
                  />
                  <button 
                    className="bg-opic-purple text-white p-1 rounded-full"
                    onClick={handleChangeName}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : (
                <h2 className="text-lg font-medium mb-1 flex items-center">
                  {userName}
                  <button 
                    className="ml-1 text-gray-400"
                    onClick={handleChangeName}
                  >
                    <Edit size={16} />
                  </button>
                </h2>
              )}
              <p className="text-gray-500 text-sm">{user?.email || 'guest@example.com'}</p>
              <p className="text-gray-500 text-sm">가입일: {user ? new Date(user.created_at).toLocaleDateString('ko-KR') : '2025년 5월 17일'}</p>
            </div>
          </div>
        </div>
        
        <Link to="/plans" className="block mb-6">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-opic-light-purple rounded-lg flex items-center justify-center text-opic-purple mr-3">
                  <Package size={20} />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">구독 정보</h3>
                  <Badge 
                    className={`${
                      subscription?.active 
                        ? subscription.plan === 'silver'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    } font-medium text-xs`}
                  >
                    {subscription?.active 
                      ? subscription.plan === 'silver' 
                        ? '실버 플랜'
                        : '골드 플랜'
                      : '스타터'}
                  </Badge>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>
        </Link>
        
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
        
        {/* FAQ Accordion - now separate */}
        <Accordion type="single" collapsible className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
          <AccordionItem value="faq" className="border-b-0">
            <AccordionTrigger className="p-4 hover:no-underline">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-opic-light-purple rounded-lg flex items-center justify-center text-opic-purple mr-3">
                  <HelpCircle size={20} />
                </div>
                <span>F.A.Q.</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1">
              <div className="border-t border-gray-100 pt-3">
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1">OPIc 시험은 어떻게 준비해야 하나요?</h4>
                  <p className="text-xs text-gray-600">꾸준한 연습과 다양한 주제에 대한 답변 연습이 가장 중요합니다.</p>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1">레벨은 어떻게 선택하나요?</h4>
                  <p className="text-xs text-gray-600">자신의 영어 실력에 맞는 레벨을 선택하시면 됩니다. 시작은 낮은 레벨부터 점차 높여가는 것을 추천합니다.</p>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1">녹음한 답변을 다시 들을 수 있나요?</h4>
                  <p className="text-xs text-gray-600">네, 히스토리에서 과거 연습 기록을 확인하실 수 있습니다.</p>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1">구독 플랜은 어떻게 변경하나요?</h4>
                  <p className="text-xs text-gray-600">프로필의 '구독 정보'에서 '변경' 버튼을 눌러 플랜을 변경할 수 있습니다.</p>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-1">친구 초대는 어떻게 하나요?</h4>
                  <p className="text-xs text-gray-600">프로필의 '친구 초대' 메뉴에서 추천 코드를 확인하고 공유할 수 있습니다.</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* App Info Accordion - now separate */}
        <Accordion type="single" collapsible className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
          <AccordionItem value="app-info" className="border-b-0">
            <AccordionTrigger className="p-4 hover:no-underline">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-opic-light-purple rounded-lg flex items-center justify-center text-opic-purple mr-3">
                  <HelpCircle size={20} />
                </div>
                <span>앱 정보</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1">
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-600">버전: 1.0.1</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <button 
          className="w-full p-2 text-left text-sm text-black flex items-center"
          onClick={handleSignOut}
        >
          <LogOut size={16} className="mr-2" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
