
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UpgradeCard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full mb-6">
      <div className="bg-[#F8F4FF] border-2 border-dotted border-[#D6B4FE] rounded-[16px] p-4">
        <h2 className="font-bold text-sm text-gray-800">현재 무료 플랜</h2>
        <p className="text-xs text-gray-600 mt-0.5 leading-4">
          실버 또는 골드 플랜으로 업그레이드하여 더 많은 기능을 사용해 보세요.
        </p>
        
        <Button 
          className="w-full mt-3 bg-[#B88BFF] hover:bg-[#A87BEF] text-white font-bold py-2 rounded-xl text-[14px]"
          onClick={() => navigate('/plans')}
        >
          실버 플랜으로 업그레이드
        </Button>
      </div>
    </div>
  );
};

export default UpgradeCard;
