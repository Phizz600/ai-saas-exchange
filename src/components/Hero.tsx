import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, CircuitBoard, Brain, Network } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Hero = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter email submitted:", newsletterEmail);
    toast.success("Successfully subscribed to newsletter!");
    setNewsletterEmail("");
  };

  // Animated background elements
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-accent via-accent2 to-accent3">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white/5 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
      </div>

      <div className="relative container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-block px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)] rounded-full border border-white/10"
          >
            The Future of AI SaaS M&A
          </motion.span>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Where AI SaaS Companies
            <br />
            <span className="bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] text-transparent bg-clip-text">
              Find Their Perfect Match
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto"
          >
            Connect with investors, participate in bid-based auctions, and grow your AI business. Get AI-powered valuations and exclusive access to premium deals.
          </motion.p>

          {/* CTA Section */}
          <div className="flex flex-col gap-6 items-center">
            {/* Marketplace Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#D946EF] hover:to-[#8B5CF6] text-white px-12 py-6 text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300"
              >
                Marketplace
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Subscribe to newsletter"
                    className="pl-10 bg-white/5 border-gray-500/30 text-white placeholder:text-gray-400"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white px-8 shadow-lg">
                  Subscribe
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <CircuitBoard className="h-8 w-8 mb-4 mx-auto text-[#D946EF]" />
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Valuations</h3>
              <p className="text-gray-300">Get accurate, data-driven valuations for your SaaS company</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Brain className="h-8 w-8 mb-4 mx-auto text-[#8B5CF6]" />
              <h3 className="text-lg font-semibold text-white mb-2">Smart Matching</h3>
              <p className="text-gray-300">Connect with the perfect investors using our AI algorithm</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Network className="h-8 w-8 mb-4 mx-auto text-[#0EA5E9]" />
              <h3 className="text-lg font-semibold text-white mb-2">Premium Network</h3>
              <p className="text-gray-300">Access our exclusive network of verified buyers and sellers</p>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <div className="mt-8 text-sm text-gray-200">
            ✓ Free AI Valuations &nbsp; • &nbsp; ✓ Secure Platform &nbsp; • &nbsp; ✓ Premium Network
          </div>
        </motion.div>
      </div>
    </div>
  );
};