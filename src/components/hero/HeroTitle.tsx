
import { motion, AnimatePresence } from "framer-motion";

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
  }} className="flex flex-col items-center mb-8 my-0 py-0">
      
      <div className="mb-6 my-[30px]">
        {/* Stars removed from here */}
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
