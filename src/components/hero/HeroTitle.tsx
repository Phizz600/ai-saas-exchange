
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface HeroTitleProps {
  currentWordIndex: number;
  words: string[];
}

const HeroTitle = ({
  currentWordIndex,
  words
}: HeroTitleProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }} 
      className="flex flex-col items-center mb-8 my-0 py-0"
    >
      <div className="flex flex-col items-center gap-2 mb-6 my-[30px]">
        <div className="w-[200px] mb-4">
          <AspectRatio ratio={16/9}>
            <img 
              src="/lovable-uploads/47eac7ab-ce1a-4bb8-800b-19f2bfcdd765.png" 
              alt="AI Exchange Logo" 
              className="object-contain w-full h-full"
            />
          </AspectRatio>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 rounded-full py-[9px]">
          <div className="flex">
            {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
          </div>
        </div>
      </div>

      <h1 className="exo-2-heading font-bold leading-tight text-white text-center mx-0 my-0 py-0 px-0 md:text-5xl text-3xl">
        The #1 Marketplace
        <br />
        for Cash-Flowing AI SaaS Businesses
        <br />
        <span className="bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] text-transparent bg-clip-text">
          Bid, Buy, or Sell at the Perfect Price
        </span>
      </h1>
    </motion.div>
  );
};

export default HeroTitle;
