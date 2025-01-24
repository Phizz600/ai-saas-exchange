import { motion, AnimatePresence } from "framer-motion";

interface AnimatedWordProps {
  words: string[];
  currentWordIndex: number;
}

const AnimatedWord = ({ words, currentWordIndex }: AnimatedWordProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentWordIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="inline-block"
      >
        {words[currentWordIndex]}
      </motion.span>
    </AnimatePresence>
  );
};

export default AnimatedWord;