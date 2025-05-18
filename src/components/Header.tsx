
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true, children }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center">
      {showBack && (
        <button 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <h1 className="text-lg font-medium text-center flex-1">{title}</h1>
      {children && (
        <div className="ml-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default Header;
