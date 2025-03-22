
import { useEffect, useRef } from "react";
import { Zap } from "lucide-react";

export const PromotionalBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    
    const animateScroll = () => {
      if (!scrollElement) return;
      if (scrollElement.scrollLeft >= scrollElement.scrollWidth / 2) {
        scrollElement.scrollLeft = 0;
      } else {
        scrollElement.scrollLeft += 1;
      }
    };
    
    const intervalId = setInterval(animateScroll, 30);
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] py-2 overflow-hidden">
      <div 
        ref={scrollRef}
        className="whitespace-nowrap overflow-hidden"
      >
        <div className="inline-block">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="inline-flex items-center text-white font-semibold px-4">
              <Zap className="h-4 w-4 mr-2 inline" />
              Beta Mode Live: Auction marketplace officially launches May 1st, 2025
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
