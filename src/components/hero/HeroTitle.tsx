
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface HeroTitleProps {
  currentWordIndex: number;
  words: string[];
}

const HeroTitle = ({ currentWordIndex, words }: HeroTitleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center mb-8"
    >
      <div className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="text-white font-medium">4.89</span>
        <span className="text-gray-200">({312} reviews)</span>
      </div>

      <h1 className="font-exo text-3xl md:text-7xl font-bold leading-tight text-white text-center">
        The #1 Marketplace
        <br />
        for AI{" "}
        <AnimatePresence mode="wait">
          <motion.span
            key={currentWordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="inline-block text-white"
          >
            {words[currentWordIndex]}
          </motion.span>
        </AnimatePresence>
        :<br />
        <span className="bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] text-transparent bg-clip-text">
          Bid, Buy, or Sell at the Perfect Price
        </span>
      </h1>
    </motion.div>
  );
};

export default HeroTitle;
