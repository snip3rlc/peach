
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { ChevronRight, Edit2, Crown, Users, Bell, HelpCircle, Info, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AuthContext } from '../App';
import { toast } from 'sonner';

const Profile = () => {
  const { user, signOut } = useContext(AuthContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('로그아웃되었습니다');
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다');
    }
  };
  
  const formatJoinDate = () => {
    const joinDate = user?.created_at ? new Date(user.created_at) : new Date();
    return `가입일: ${joinDate.getFullYear()}년 ${joinDate.getMonth() + 1}월 ${joinDate.getDate()}일`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="프로필" showBack={false} />
      
      <div className="p-4 pb-24 space-y-4">
        {/* Profile Info */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex items-center">
            <div className="relative">
              <Avatar className="h-16 w-16 bg-opic-light-purple text-opic-purple">
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || '게'}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 bg-opic-purple text-white rounded-full p-1">
                <Edit2 size={12} />
              </button>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h2 className="font-medium text-lg">게스트 사용자</h2>
                <button className="ml-2 text-gray-400">
                  <Edit2 size={16} />
                </button>
              </div>
              <p className="text-gray-500 text-sm">{user?.email || 'guest@example.com'}</p>
              <p className="text-gray-500 text-sm">{formatJoinDate()}</p>
            </div>
          </div>
        </div>
        
        {/* Subscription Info */}
        <Link to="/plans" className="block">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-opic-light-purple rounded-lg flex items-center justify-center mr-3">
                <Crown className="text-opic-purple" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">구독 정보</h3>
              </div>
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">스타터</span>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        </Link>
        
        {/* Friend Referral */}
        <Link to="/referral" className="block">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-opic-light-purple rounded-lg flex items-center justify-center mr-3">
                <Users className="text-opic-purple" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">친구 초대</h3>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        </Link>
        
        {/* Notifications */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-opic-light-purple rounded-lg flex items-center justify-center mr-3">
                <Bell className="text-opic-purple" size={20} />
              </div>
              <h3 className="font-medium">알림</h3>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>
        
        {/* FAQ with Collapsible */}
        <Collapsible open={isFaqOpen} onOpenChange={setIsFaqOpen}>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <CollapsibleTrigger className="flex items-center w-full">
              <div className="h-10 w-10 bg-opic-light-purple rounded-lg flex items-center justify-center mr-3">
                <HelpCircle className="text-opic-purple" size={20} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">F.A.Q.</h3>
              </div>
              <ChevronRight size={18} className={`text-gray-400 transition-transform ${isFaqOpen ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 pl-13">
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">앱 사용법</h4>
                  <p className="text-gray-600">이 앱은 영어 말하기 연습을 위한 OPIC 시뮬레이션 앱입니다. 레벨을 선택하고 주제를 고른 후 질문에 답변하며 연습할 수 있습니다.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">결제</h4>
                  <p className="text-gray-600">프리미엄 기능을 이용하려면 구독 플랜을 선택하세요. 결제는 안전하게 처리되며 언제든지 취소할 수 있습니다.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">구독 변경</h4>
                  <p className="text-gray-600">구독 정보 메뉴에서 플랜을 변경하거나 취소할 수 있습니다. 변경사항은 다음 결제 주기부터 적용됩니다.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">보안</h4>
                  <p className="text-gray-600">모든 개인정보는 안전하게 암호화되어 저장됩니다. 음성 녹음은 학습 목적으로만 사용되며 제3자와 공유되지 않습니다.</p>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
        
        {/* About with Collapsible */}
        <Collapsible open={isAppInfoOpen} onOpenChange={setIsAppInfoOpen}>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <CollapsibleTrigger className="flex items-center w-full">
              <div className="h-10 w-10 bg-opic-light-purple rounded-lg flex items-center justify-center mr-3">
                <Info className="text-opic-purple" size={20} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">앱 정보</h3>
              </div>
              <ChevronRight size={18} className={`text-gray-400 transition-transform ${isAppInfoOpen ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 pl-13">
              <div className="text-sm text-gray-600">
                <p className="mb-2">버전: V1.0</p>
                <p>OPIC 영어 말하기 연습을 위한 시뮬레이션 앱입니다. 실제 시험과 유사한 환경에서 연습하며 AI 피드백을 받을 수 있습니다.</p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
        
        {/* Log Out Card */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full"
          >
            <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
              <LogOut className="text-red-500" size={20} />
            </div>
            <h3 className="font-medium text-gray-500">로그아웃</h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
