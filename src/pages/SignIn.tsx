
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Apple, LogIn } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Get redirect params if any
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect');
  const plan = searchParams.get('plan');
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // If redirecting to subscription checkout
        if (redirect === 'subscribe' && plan) {
          handleCheckout(plan);
        } else {
          navigate('/');
        }
      }
    };
    
    checkAuth();
  }, [navigate, redirect, plan]);
  
  const handleCheckout = async (planType: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });
      
      if (error) {
        toast.error('결제 페이지를 불러오는 중 오류가 발생했습니다.');
        console.error('Error creating checkout:', error);
        return;
      }
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      // Navigate to the profile page
      navigate('/profile');
    } catch (error) {
      toast.error('결제 페이지를 불러오는 중 오류가 발생했습니다.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialSignIn = async (provider: 'google' | 'apple' | 'kakao') => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin + (redirect ? `?redirect=${redirect}&plan=${plan || ''}` : '')
        }
      });
      
      if (error) {
        toast.error(`${provider} 로그인 중 오류가 발생했습니다.`);
        console.error(`Error signing in with ${provider}:`, error);
      }
    } catch (error) {
      toast.error(`로그인 중 오류가 발생했습니다.`);
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="로그인" showBack={true} />
      
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">OPIc Practice</h1>
            <p className="text-gray-600">소셜 계정으로 로그인하세요</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="space-y-4">
              <Button 
                onClick={() => handleSocialSignIn('google')} 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 py-6 border-2 border-gray-200"
                disabled={loading}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google로 계속하기
              </Button>
              
              <Button 
                onClick={() => handleSocialSignIn('kakao')} 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 py-6 bg-[#FEE500] border-0 text-black hover:bg-[#FDD800]"
                disabled={loading}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 4C6.48 4 2 7.52 2 11.88C2 14.82 3.87 17.37 6.71 18.7L5.58 22.58C5.51 22.81 5.69 23 5.9 23C5.96 23 6.02 22.98 6.07 22.95L10.73 20.12C11.15 20.17 11.57 20.2 12 20.2C17.52 20.2 22 16.68 22 11.88C22 7.52 17.52 4 12 4Z" fill="black"/>
                </svg>
                카카오로 계속하기
              </Button>
              
              <Button 
                onClick={() => handleSocialSignIn('apple')} 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 py-6 bg-black text-white hover:bg-gray-800 border-0"
                disabled={loading}
              >
                <Apple size={24} />
                Apple로 계속하기
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>로그인하면 <a href="#" className="text-opic-purple hover:underline">서비스 약관</a>과 <a href="#" className="text-opic-purple hover:underline">개인정보 보호정책</a>에 동의하게 됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
