import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, CircuitBoard, Brain, Network } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const Hero = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const navigate = useNavigate();
  
  const words = ["Companies", "Businesses", "Apps", "Plugins", "Tools", "MVPs"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter email submitted:", newsletterEmail);
    toast.success("Successfully joined the waitlist!");
    setNewsletterEmail("");
  };

  // Enhanced animated background elements
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 15 + 5,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent2 to-accent3 animate-gradient">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] opacity-50" />
        
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="relative container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-exo text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Where AI{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                {words[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
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
            Connect with top-tier investors, pitch your AI business or idea, and participate in timed, bid-based auctions. Unlock exclusive access to premium deals and accelerate the growth of your AI company.
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
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Join the Early Bird Waitlist"
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
                </div>
                <p className="text-sm text-gray-300 px-2">
                  Be one of the first 1,000 AI builders to join our waitlist and receive a{' '}
                  <span className="text-[#D946EF] font-semibold">free AI-powered valuation</span> plus{' '}
                  <span className="text-[#0EA5E9] font-semibold">exclusive lifetime membership (valued at $20/month)</span> when we go live.
                </p>
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
