
import { Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const recentSales = [
  "AI Chatbot sold for $45,000",
  "ML Model acquired for $28,000",
  "NLP Tool purchased for $35,000",
  "Data Pipeline sold for $52,000"
];

const testimonials = [
  {
    text: "Acquired an NLP tool in 48 hours. The escrow process was seamless!",
    author: "Sarah, AI Investor",
    avatar: "/placeholder.svg"
  },
  {
    text: "The verification process gave me confidence in my purchase.",
    author: "Michael, Tech Entrepreneur",
    avatar: "/placeholder.svg"
  },
  {
    text: "Smooth transaction from start to finish. Highly recommended!",
    author: "David, ML Engineer",
    avatar: "/placeholder.svg"
  }
];

export function TrustBoosters() {
  const [currentSaleIndex, setCurrentSaleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSaleIndex((prev) => (prev + 1) % recentSales.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 mb-12">
      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-lg">Escrow Protected</h3>
          </div>
          <p className="mt-2 text-gray-600">
            Your payment is held securely until the transfer is complete
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-lg">100% Verified Listings</h3>
          </div>
          <p className="mt-2 text-gray-600">
            Every product undergoes thorough verification
          </p>
        </div>
      </div>

      {/* Recent Sales Ticker */}
      <div className="bg-gradient-to-r from-accent2 to-accent3 text-white p-4 rounded-lg overflow-hidden">
        <motion.div
          key={currentSaleIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center font-medium"
        >
          🎉 {recentSales[currentSaleIndex]}
        </motion.div>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-gray-700 mb-2">"{testimonial.text}"</p>
                <p className="text-sm text-gray-500">– {testimonial.author}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
