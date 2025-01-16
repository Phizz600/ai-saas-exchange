import { motion } from "framer-motion";

export const Stats = () => {
  const stats = [
    { label: "Listed Companies", value: "100+" },
    { label: "Total Value", value: "$50M+" },
    { label: "Successful Deals", value: "25+" },
    { label: "Active Buyers", value: "500+" },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};