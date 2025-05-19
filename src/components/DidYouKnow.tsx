
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
    <div className="w-full mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-medium">💡 알고 계셨나요?</h2>
      </div>

      <Card className="shadow-md overflow-hidden">
        <Collapsible className="w-full">
          <CollapsibleTrigger className="w-full p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
            <div className="text-left">
              <p className="text-sm font-medium">{question}</p>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200 ease-in-out" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-5 pb-5 bg-gray-50 border-t border-gray-100 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <p className="text-sm leading-relaxed pt-3">{answer}</p>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default DidYouKnow;
