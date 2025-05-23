
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Info, BookOpen, Volume2, PenTool } from "lucide-react";

export type TipType = "culture" | "conversation" | "grammar" | "vocabulary" | "pronunciation";

export interface TipCardProps {
  type: TipType;
  title: string;
  content: string;
}

const TipCard = ({ type, title, content }: TipCardProps) => {
  const getIcon = () => {
    switch (type) {
      case "culture":
        return <Info className="h-5 w-5 text-amber-500" />;
      case "conversation":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "grammar":
        return <PenTool className="h-5 w-5 text-green-500" />;
      case "vocabulary":
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case "pronunciation":
        return <Volume2 className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "culture":
        return "문화 팁";
      case "conversation":
        return "대화 팁";
      case "grammar":
        return "문법 팁";
      case "vocabulary":
        return "어휘 팁";
      case "pronunciation":
        return "발음 팁";
      default:
        return "팁";
    }
  };

  return (
    <Card className="shadow-md h-full min-h-[180px] min-w-[260px] hover:shadow-lg transition-shadow">
      <CardContent className="py-4 px-5">
        <div className="flex items-center mb-2 gap-2">
          {getIcon()}
          <h3 className="text-base font-medium">
            {getTypeLabel()}
          </h3>
        </div>
        <p className="text-[15px] text-gray-600 leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  );
};

export default TipCard;
