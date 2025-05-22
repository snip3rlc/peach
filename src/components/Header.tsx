
import React, { ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User } from 'lucide-react';
import { AuthContext } from '../App';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true, children }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center safe-area-top">
      {showBack && (
        <button 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <h1 className="text-lg font-medium text-center flex-1">{title}</h1>
      {children ? (
        <div className="ml-auto">
          {children}
        </div>
      ) : !user ? (
        <div className="ml-auto">
          <button onClick={() => navigate('/signin')} className="p-2">
            <User size={20} />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Header;
