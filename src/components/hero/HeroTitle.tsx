import { motion } from "framer-motion";
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
  }} className="flex flex-col items-center mb-8 px-0 mx-0 my-0 py-0">
      {/* Product Hunt Badge replacing the stars */}
      <div className="mb-6">
        <a href="https://www.producthunt.com/posts/ai-exchange-club?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-ai&#0045;exchange&#0045;club" target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
          
        </a>
      </div>

      {/* 5 Star Badge */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-1 bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">★</span>
          ))}
        </div>
      </div>

      <h1 className="exo-2-heading font-bold leading-tight text-white text-center sm:text-3xl md:text-4xl lg:text-5xl my-0 mx-0 py-0 max-w-5xl px-0 text-3xl">
        Helping AI SaaS Founders Exit
        <br />
        <span className="bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] text-transparent bg-clip-text">Sell Smarter, Sell Faster!</span>
      </h1>
    </motion.div>;
};
export default HeroTitle;