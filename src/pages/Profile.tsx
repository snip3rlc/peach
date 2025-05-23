
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Users, 
  Info, 
  LogOut,
  Crown
} from 'lucide-react';
import { AuthContext } from '../App';
import { toast } from 'sonner';

const Profile = () => {
  const { user, signOut } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('로그아웃되었습니다');
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset">
      <Header title="프로필" />
      
      <div className="px-4 pt-4 pb-24 space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-opic-purple rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {user?.user_metadata?.full_name || user?.email || 'User'}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <Link to="/plans" className="block">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-opic-purple" />
                <div>
                  <h3 className="font-medium">구독 정보</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">스타터 플랜</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      현재 구독 중
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-gray-400">→</div>
            </div>
          </div>
        </Link>

        {/* Menu Items */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">내 계정</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span>개인정보 설정</span>
                </div>
                <div className="text-gray-400">→</div>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <span>결제 관리</span>
                </div>
                <div className="text-gray-400">→</div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">일반</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <span>알림 설정</span>
                </div>
                <div className="text-gray-400">→</div>
              </button>
              
              <Link to="/referral" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>친구 초대하기</span>
                </div>
                <div className="text-gray-400">→</div>
              </Link>
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Info className="w-5 h-5 text-gray-500" />
                  <span>앱 정보</span>
                </div>
                <div className="text-gray-400">→</div>
              </button>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <Button 
          onClick={handleSignOut}
          variant="destructive" 
          className="w-full flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>로그아웃</span>
        </Button>

        <div className="text-center text-sm text-gray-500">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Profile;
