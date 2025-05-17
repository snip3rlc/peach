
import React, { useState } from 'react';
import Header from '../components/Header';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Referral = () => {
  const [referralCode] = useState('GUEST123');
  const [referralLink] = useState('https://opic-master.com/join?ref=GUEST123');
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "복사 완료",
      description: "링크가 클립보드에 복사되었습니다."
    });
  };
  
  const sendInvitation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "초대 발송 완료",
      description: "친구에게 초대장이 발송되었습니다."
    });
    
    const form = e.target as HTMLFormElement;
    form.reset();
  };
  
  return (
    <div>
      <Header title="친구 초대하기" showBack />
      
      <div className="p-4">
        {/* Referral Card */}
        <div className="bg-opic-purple rounded-lg p-6 mb-6 text-center text-white">
          <div className="bg-white/20 w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4">
            <Share size={28} className="text-white" />
          </div>
          
          <h2 className="text-lg font-medium mb-2">친구를 초대하고 10% 할인 받으세요!</h2>
          <p className="text-sm opacity-90">
            친구가 가입하면 여러분과 친구 모두 구독의 10%를 할인 받을 수 있습니다.
          </p>
        </div>
        
        {/* Referral Code Section */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
          <h3 className="text-sm mb-2">나의 추천 코드</h3>
          <div className="bg-gray-100 p-4 text-center rounded-lg mb-4">
            <span className="text-opic-purple font-medium text-lg">{referralCode}</span>
          </div>
          
          <div className="flex items-center border border-gray-200 rounded-lg mb-4">
            <input 
              type="text" 
              className="flex-1 p-3 bg-transparent outline-none text-sm truncate" 
              value={referralLink} 
              readOnly
            />
            <button 
              onClick={copyToClipboard}
              className="p-3"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4V1H14V4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 4H14V14H4V4Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <Button 
            onClick={copyToClipboard}
            className="w-full bg-opic-purple hover:bg-opic-purple/90"
          >
            링크 복사하기
          </Button>
        </div>
        
        {/* Email Invitation */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
          <h3 className="text-sm mb-3">이메일로 초대하기</h3>
          <form onSubmit={sendInvitation}>
            <div className="relative mb-4">
              <input 
                type="email" 
                className="w-full p-3 pr-10 border border-gray-200 rounded-lg outline-none" 
                placeholder="친구 이메일 입력" 
                required
              />
              <button 
                type="submit"
                className="absolute top-1/2 right-3 transform -translate-y-1/2"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2L9 11" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 2L12 18L9 11L2 8L18 2Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-opic-purple hover:bg-opic-purple/90"
            >
              초대장 보내기
            </Button>
          </form>
        </div>
        
        <p className="text-xs text-center text-gray-500">
          초대한 친구가 가입하면 알림을 보내드립니다. 할인은 다음 결제부터 자동으로 적용됩니다.
        </p>
      </div>
    </div>
  );
};

export default Referral;
