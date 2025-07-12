
import { motion } from "framer-motion";
import { Rocket, BarChart3, Settings, MessageCircle, Search, Shield } from "lucide-react";

export const FounderValueStack = () => {
  const values = [
    {
      icon: Rocket,
      title: "Free Access to Serious, Vetted Buyers",
      description: "Our buyers aren't just investors; they're operators, indie acquirers, and micro-PE firms who get AI."
    },
    {
      icon: BarChart3,
      title: "Listing Toolkit + Smart Templates",
      description: "From listing drafts to deal docs, we give you the resources to make your exit simple and credible."
    },
    {
      icon: Settings,
      title: "Flexible Selling Model",
      description: "Run a Dutch auction or set a fixed price—you're always in control."
    },
    {
      icon: MessageCircle,
      title: "Always-On Founder Support",
      description: "Get fast answers from real humans, not forms. We're responsive, respectful, and ready."
    },
    {
      icon: Search,
      title: "Optional Due Diligence Help",
      description: "Want to make your deal more attractive? We can help you prepare a clean, buyer-ready package (optional add-on)."
    },
    {
      icon: Shield,
      title: "Privacy Friendly",
      description: "Stay anonymous until you're ready to talk. No spam. No pressure."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <span className="text-2xl mb-4 block">🎁</span>
          <h2 className="exo-2-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Founder-First Value Stack
          </h2>
          <p className="text-lg text-gray-600">
            When you list with AIExchange.club, here's what you get:
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-[#D946EE]/10 via-[#8B5CF6]/10 to-[#0EA4E9]/10">
                  <value.icon className="h-6 w-6 text-[#8B5CF6]" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
