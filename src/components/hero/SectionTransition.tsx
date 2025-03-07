
import { motion } from "framer-motion";

const SectionTransition = () => {
  return (
    <div className="relative py-16">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent3/90 to-accent/90 overflow-hidden">
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Central connecting element */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-1 h-24 bg-gradient-to-b from-[#D946EE] to-[#0EA4E9] rounded-full mb-6" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <span className="text-2xl text-white">⟶</span>
            </div>
          </div>
          <div className="w-1 h-24 bg-gradient-to-t from-[#D946EE] to-[#0EA4E9] rounded-full mt-6" />
        </motion.div>
      </div>
    </div>
  );
};

export default SectionTransition;
