
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setLoading(true);
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData?.session) {
          navigate('/signin');
          return;
        }
        
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
          return;
        }
        
        setSubscription(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSubscription();
  }, [navigate]);

  return (
    <div className="pb-20">
      <Header title="구독 완료" />
      
      <div className="p-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        
        <h1 className="text-xl font-bold text-center mb-2">결제가 완료되었습니다!</h1>
        <p className="text-gray-600 text-center mb-6">
          OPIc 시험 준비를 위한 프리미엄 기능을 이용해 보세요.
        </p>
        
        {loading ? (
          <div className="w-full bg-gray-100 animate-pulse h-20 rounded-md mb-6"></div>
        ) : subscription ? (
          <div className="w-full bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h2 className="font-medium mb-2">구독 정보</h2>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">플랜:</span>
              <span className="text-sm font-medium">
                {subscription.plan === 'silver' ? '실버 플랜' : 
                 subscription.plan === 'gold' ? '골드 플랜' : '알 수 없음'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">다음 결제일:</span>
              <span className="text-sm font-medium">
                {subscription.current_period_end ? 
                  new Date(subscription.current_period_end).toLocaleDateString('ko-KR') : 
                  '알 수 없음'}
              </span>
            </div>
            {subscription.cancel_at_period_end && (
              <div className="mt-2 text-sm text-orange-600">
                * 구독이 다음 결제일에 자동으로 해지됩니다.
              </div>
            )}
          </div>
        ) : (
          <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-yellow-700">
              구독 정보를 불러오는데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>
          </div>
        )}
        
        <div className="space-y-3 w-full">
          <Button 
            className="w-full" 
            onClick={() => navigate('/profile')}
          >
            프로필로 이동
          </Button>
          <Button 
            variant="outline"
            className="w-full" 
            onClick={() => navigate('/practice')}
          >
            연습하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
