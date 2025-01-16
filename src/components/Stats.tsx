import { motion } from "framer-motion";

export const Stats = () => {
  const stats = [
    { label: "Listed Companies", value: "100+" },
    { label: "Total Value", value: "$50M+" },
    { label: "Successful Deals", value: "25+" },
    { label: "Active Buyers", value: "500+" },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};