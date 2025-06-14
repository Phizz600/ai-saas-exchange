
import { motion } from "framer-motion";

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
      {/* Product Hunt Badge replacing the stars */}
      <div className="mb-6">
        <a 
          href="https://www.producthunt.com/posts/ai-exchange-club?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-ai&#0045;exchange&#0045;club" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:opacity-90 transition-opacity"
        >
          <img 
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=966896&theme=neutral&t=1747524751594" 
            alt="AI Exchange Club - Bid, buy, and sell cash-flowing AI SaaS businesses | Product Hunt" 
            style={{ width: "190px", height: "41px" }} 
            width="190" 
            height="41" 
          />
        </a>
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
