
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export const PromotionalBanner = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const animateScroll = () => {
      setScrollPosition(prev => {
        // Reset when we reach halfway through
        if (prev >= 500) {
          return 0;
        }
        return prev + 1;
      });
    };
    
    const intervalId = setInterval(animateScroll, 30);
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] py-2 overflow-hidden">
      <div 
        className="whitespace-nowrap overflow-hidden"
        style={{ transform: `translateX(-${scrollPosition}px)` }}
      >
        <div className="inline-block">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="inline-flex items-center text-white font-semibold px-4">
              <Zap className="h-4 w-4 mr-2 inline" />
              Auction marketplace officially launches soon!
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
