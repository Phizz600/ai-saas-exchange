import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export const MarketplaceFooter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
    setEmail("");
  };

  // Generate particles for the background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
  }));

  return (
    <footer className="w-screen bg-gradient-to-r from-accent2 via-accent to-accent3 mt-24 py-16 text-white relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white/10 rounded-full"
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
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-semibold mb-6">AI Exchange Club</h3>
            <p className="text-white/80 mb-8 max-w-md">
              Join our newsletter to stay up to date with the latest AI SaaS
              opportunities and market insights.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-white/80 hover:text-white">About</a></li>
              <li><a href="/careers" className="text-white/80 hover:text-white">Careers</a></li>
              <li><a href="/blog" className="text-white/80 hover:text-white">Blog</a></li>
              <li><a href="/press" className="text-white/80 hover:text-white">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/help" className="text-white/80 hover:text-white">Help Center</a></li>
              <li><a href="/terms" className="text-white/80 hover:text-white">Terms of Service</a></li>
              <li><a href="/privacy" className="text-white/80 hover:text-white">Privacy Policy</a></li>
              <li><a href="/contact" className="text-white/80 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © 2025 AI Exchange Club. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="https://youtube.com" className="text-white/60 hover:text-white">YouTube</a>
              <a href="https://instagram.com" className="text-white/60 hover:text-white">Instagram</a>
              <a href="https://twitter.com" className="text-white/60 hover:text-white">Twitter</a>
              <a href="https://linkedin.com" className="text-white/60 hover:text-white">LinkedIn</a>
              <a href="https://github.com" className="text-white/60 hover:text-white">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};