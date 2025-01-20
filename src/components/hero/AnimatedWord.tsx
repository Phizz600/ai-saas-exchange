import { motion, AnimatePresence } from "framer-motion";

interface AnimatedWordProps {
  words: string[];
  currentWordIndex: number;
}

export const AnimatedWord = ({ words, currentWordIndex }: AnimatedWordProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentWordIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="inline-block"
      >
        {words[currentWordIndex]}
      </motion.span>
    </AnimatePresence>
  );
};