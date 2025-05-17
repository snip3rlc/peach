
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, History, DollarSign, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active-nav-item' : 'nav-item';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 z-10">
      <Link to="/" className={`flex flex-col items-center ${isActive('/')}`}>
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link to="/practice" className={`flex flex-col items-center ${isActive('/practice')}`}>
        <BookOpen size={20} />
        <span className="text-xs mt-1">Practice</span>
      </Link>
      <Link to="/history" className={`flex flex-col items-center ${isActive('/history')}`}>
        <History size={20} />
        <span className="text-xs mt-1">History</span>
      </Link>
      <Link to="/plans" className={`flex flex-col items-center ${isActive('/plans')}`}>
        <DollarSign size={20} />
        <span className="text-xs mt-1">Plans</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile')}`}>
        <User size={20} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav;
