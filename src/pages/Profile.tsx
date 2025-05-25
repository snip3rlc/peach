
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { ChevronRight, Edit2, Crown, Users, Bell, HelpCircle, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { AuthContext } from '../App';
import { toast } from 'sonner';

const Profile = () => {
  const { user, signOut } = useContext(AuthContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
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
      <Header title="프로필" showBack={true} />
      
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
        
        {/* FAQ */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-opic-light-purple rounded-lg flex items-center justify-center mr-3">
              <HelpCircle className="text-opic-purple" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">F.A.Q.</h3>
              <p className="text-xs text-gray-500 mt-1">앱 사용법 • 결제 • 구독 변경 • 보안</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
        
        {/* About */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-opic-light-purple rounded-lg flex items-center justify-center mr-3">
              <Info className="text-opic-purple" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">앱 정보</h3>
              <p className="text-xs text-gray-500 mt-1">V1.0</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
        
        {/* Log Out */}
        <button 
          onClick={handleSignOut}
          className="flex items-start justify-start text-gray-500 font-medium p-3 w-full text-left"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Profile;
