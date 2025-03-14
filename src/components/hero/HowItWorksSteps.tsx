import { motion } from "framer-motion";
const HowItWorksSteps = () => {
  return <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
          <div className="text-2xl font-bold text-white mb-2">1</div>
          <h3 className="text-xl font-semibold text-white mb-3">List Your Product</h3>
          <p className="text-gray-300">List your AI SaaS business, product, tool, etc, with a starting price.</p>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
          <div className="text-2xl font-bold text-white mb-2">2</div>
          <h3 className="text-xl font-semibold text-white mb-3">Watch Prices Drop</h3>
          <p className="text-gray-300">Buyers bid as the price drops daily/hourly.</p>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
          <div className="text-2xl font-bold text-white mb-2">3</div>
          <h3 className="text-xl font-semibold text-white mb-3">Secure the Deal</h3>
          <p className="text-gray-300">The highest bidder at the end of the auction wins if the buyer agrees to sell.</p>
        </motion.div>
      </div>
    </div>;
};
export default HowItWorksSteps;