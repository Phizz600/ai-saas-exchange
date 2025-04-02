
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface HeroTitleProps {
  currentWordIndex: number;
  words: string[];
}

const HeroTitle = ({
  currentWordIndex,
  words
}: HeroTitleProps) => {
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="flex flex-col items-center mb-8">
      <span className="text-white text-xs italic mb-2">powered by artificial intelligence</span>
      <div className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm px-4 rounded-full py-[9px] my-[30px]">
        <div className="flex">
          {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
        </div>
      </div>

      <h1 className="exo-2-heading font-bold leading-tight text-white text-center mx-0 my-0 py-0 px-0 md:text-6xl text-3xl">
        The #1 Marketplace
        <br />
        for AI{" "}
        <AnimatePresence mode="wait">
          <motion.span key={currentWordIndex} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} transition={{
          duration: 0.3
        }} className="inline-block text-white">
            {words[currentWordIndex]}
          </motion.span>
        </AnimatePresence>
        :<br />
        <span className="bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] text-transparent bg-clip-text">
          Bid, Buy, or Sell at the Perfect Price
        </span>
      </h1>
    </motion.div>;
};

export default HeroTitle;
