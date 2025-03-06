import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
export const Footer = () => {
  const [email, setEmail] = useState("");

  // Create floating particles effect
  const particles = Array.from({
    length: 20
  }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: 3 + Math.random() * 4
  }));
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Open the subscription URL in a new tab
    window.open("https://aiexchangeclub.beehiiv.com/subscribe", "_blank");
    toast.success("Redirecting you to our newsletter!", {
      description: "You'll be able to subscribe to updates about new AI products and features."
    });
  };
  return <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent2 to-accent3">
        {particles.map(particle => <motion.div key={particle.id} className="absolute rounded-full bg-white/10 backdrop-blur-sm" style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size
      }} animate={{
        y: [0, -30, 0],
        x: [0, Math.random() * 20 - 10, 0],
        opacity: [0.2, 0.5, 0.2]
      }} transition={{
        duration: particle.duration,
        repeat: Infinity,
        ease: "easeInOut"
      }} />)}
      </div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-4 md:col-span-1">
            <div className="flex flex-col items-center md:items-start">              
              <div className="w-full max-w-md">
                <h3 className="text-white font-semibold mb-2 text-center md:text-left">Get Early Access to Off-Market AI Deals</h3>
                <p className="text-white/80 text-sm mb-4 text-center md:text-left">Join 1,000+ AI founders and investors</p>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity text-white font-semibold"
                    onClick={() => window.open("https://aiexchangeclub.beehiiv.com/subscribe", "_blank")}
                  >
                    Join the Club
                  </Button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-4 md:col-span-1">
            <h4 className="font-bold text-white text-center md:text-left">Company</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-center md:text-left">
                <Link to="/about" className="text-white/80 hover:text-white">About Us</Link>
              </li>
              <li className="text-center md:text-left">
                <Link to="/contact" className="text-white/80 hover:text-white">Contact</Link>
              </li>
              <li className="text-center md:text-left">
                <Link to="/careers" className="text-white/80 hover:text-white">Careers</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-4 md:col-span-1">
            <h4 className="font-bold text-white text-center md:text-left">Resources</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-center md:text-left">
                <a href="https://aiexchangeclub.beehiiv.com/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">Blog</a>
              </li>
              <li className="text-center md:text-left">
                <Link to="/fees-pricing" className="text-white/80 hover:text-white">Fees & Pricing</Link>
              </li>
              <li className="text-center md:text-left">
                <Link to="/policies" className="text-white/80 hover:text-white">Policies</Link>
              </li>
              <li className="text-center md:text-left">
                <Link to="/resolution-center" className="text-white/80 hover:text-white">Resolution Center</Link>
              </li>
              <li className="text-center md:text-left">
                <Link to="/faq" className="text-white/80 hover:text-white">FAQ</Link>
              </li>
              <li className="text-center md:text-left">
                <Link to="/terms" className="text-white/80 hover:text-white">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-4 md:col-span-1">
            <h4 className="font-bold text-white text-center md:text-left">Follow Us</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-center md:text-left">
                <Link to="#" className="text-white/80 hover:text-white">Facebook</Link>
              </li>
              <li className="text-center md:text-left">
                <Link to="#" className="text-white/80 hover:text-white">Twitter</Link>
              </li>
              <li className="text-center md:text-left">
                <Link to="#" className="text-white/80 hover:text-white">Instagram</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>;
};
