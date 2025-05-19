
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Info } from "lucide-react";

export type TipType = "culture" | "conversation";

export interface TipCardProps {
  type: TipType;
  title: string;
  content: string;
}

const TipCard = ({ type, title, content }: TipCardProps) => {
  return (
    <Card className="shadow-md h-full min-h-[180px] min-w-[260px] hover:shadow-lg transition-shadow">
      <CardContent className="py-4 px-5">
        <div className="flex items-center mb-2 gap-2">
          {type === "culture" ? (
            <Info className="h-5 w-5 text-amber-500" />
          ) : (
            <MessageSquare className="h-5 w-5 text-blue-500" />
          )}
          <h3 className="text-base font-medium">
            {type === "culture" ? "문화 팁" : "대화 팁"}
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
