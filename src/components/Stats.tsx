import { motion } from "framer-motion";

export const Stats = () => {
  const stats = [
    { label: "Listed Companies", value: "100+" },
    { label: "Total Value", value: "$50M+" },
    { label: "Successful Deals", value: "25+" },
    { label: "Active Buyers", value: "500+" },
  ];

  return (
    <div className="py-16 bg-accent2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};