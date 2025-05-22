
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tab, setTab] = useState<string>('login');
  
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
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('로그인 성공!');
      
      // If redirecting to subscription checkout
      if (redirect === 'subscribe' && plan) {
        handleCheckout(plan);
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error('로그인 중 오류가 발생했습니다.');
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split('@')[0]
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('회원가입 성공! 로그인해 주세요.');
      setTab('login');
    } catch (error) {
      toast.error('회원가입 중 오류가 발생했습니다.');
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">OPIc Practice</h1>
          <p className="text-gray-600">{tab === 'login' ? '로그인하여 시작하세요' : '계정을 생성하세요'}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <Tabs defaultValue="login" value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="register">회원가입</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      placeholder="example@email.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "로그인 중..." : "로그인"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">이메일</Label>
                    <Input
                      id="signup-email"
                      placeholder="example@email.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">비밀번호</Label>
                    <Input
                      id="signup-password"
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">비밀번호 확인</Label>
                    <Input
                      id="confirm-password"
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "가입 중..." : "회원가입"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
