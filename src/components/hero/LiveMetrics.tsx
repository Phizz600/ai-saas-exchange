
import { motion } from "framer-motion";
import { Users, Clock, TrendingUp } from "lucide-react";

const LiveMetrics = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mt-12"
    >
      <h3 className="text-white text-lg font-semibold text-center mb-6">Live Activity</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-[#8B5CF6] mr-2" />
            <span className="text-2xl font-bold text-white">3</span>
          </div>
          <p className="text-gray-300 text-sm">New listings this week</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-[#0EA4E9] mr-2" />
            <span className="text-2xl font-bold text-white">18hr</span>
          </div>
          <p className="text-gray-300 text-sm">Avg. time to first inquiry</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-[#D946EE] mr-2" />
            <span className="text-2xl font-bold text-white">94%</span>
          </div>
          <p className="text-gray-300 text-sm">Listings receive buyer interest</p>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-xs">
          * Based on activity from the last 30 days in our Slack community
        </p>
      </div>
    </motion.div>
  );
};

export default LiveMetrics;
