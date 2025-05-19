
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TipCard, { TipCardProps } from "./TipCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface TipsCarouselProps {
  tips: TipCardProps[];
}

const TipsCarousel = ({ tips }: TipsCarouselProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-medium">💡 오늘의 팁</h2>
        <p className="text-sm text-gray-500">
          짧고 유용한 영어 팁으로 실력을 키워보세요.
        </p>
      </div>
      
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {tips.map((tip, index) => (
              <CarouselItem 
                key={index} 
                className={isMobile ? "pl-4 basis-[85%]" : "pl-4 md:basis-1/2 lg:basis-1/3"}
              >
                <TipCard
                  type={tip.type}
                  title={tip.title}
                  content={tip.content}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </div>
  );
};

export default TipsCarousel;
