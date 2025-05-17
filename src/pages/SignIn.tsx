
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SignIn = () => {
  const navigate = useNavigate();
  
  const handleGoogleSignIn = () => {
    // This would typically interact with Google OAuth
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };
  
  const handleKakaoSignIn = () => {
    // This would typically interact with Kakao OAuth
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-opic-purple mb-2">OPIc 마스터</h1>
            <p className="text-gray-600">로그인하여 OPIc 연습을 시작하세요</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Google로 계속하기
            </Button>
            
            <Button 
              onClick={handleKakaoSignIn}
              className="w-full bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90 flex items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <g clipPath="url(#clip0_1_2)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 4C7.286 4 3 7.3312 3 11.4778C3 14.0751 4.865 16.2969 7.546 17.5304C7.316 18.3003 6.752 20.4214 6.648 20.794C6.52 21.2682 6.863 21.2646 7.074 21.1327C7.237 21.0323 9.945 19.2012 11.098 18.4578C11.393 18.49 11.693 18.5072 12 18.5072C16.714 18.5072 21 15.176 21 11.0293C21 7.3312 16.714 4 12 4Z" fill="black"/>
                </g>
                <defs>
                  <clipPath id="clip0_1_2">
                    <rect width="18" height="18" fill="white" transform="translate(3 3)"/>
                  </clipPath>
                </defs>
              </svg>
              카카오로 계속하기
            </Button>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>로그인함으로써 당사의 서비스 이용약관 및 개인정보 처리방침에 동의합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
