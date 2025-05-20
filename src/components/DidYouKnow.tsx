
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface DidYouKnowProps {
  question: string;
  answer: string;
  type?: "culture" | "conversation";
}

const DidYouKnow = ({ question, answer, type = "culture" }: DidYouKnowProps) => {
  return (
    <div className="w-full mb-6">
      <div className="mb-2">
        <h2 className="text-sm font-medium">알고 계셨나요?</h2>
      </div>

      <Card className="shadow-md border border-dotted border-[#A78BFA] rounded-[12px] p-[12px]">
        <Collapsible className="w-full">
          <CollapsibleTrigger className="w-full p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <p className="text-sm font-medium">{question}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 ease-in-out" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3 bg-gray-50 border-t border-gray-100 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <p className="text-sm leading-relaxed pt-2">{answer}</p>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default DidYouKnow;
