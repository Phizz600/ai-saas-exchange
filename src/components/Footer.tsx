
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Linkedin, Youtube, Instagram } from "lucide-react";

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

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent2 to-accent3">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-200 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-200 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-200 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-200 hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/nda-policy" className="text-gray-200 hover:text-white transition">
                  NDA Policy
                </Link>
              </li>
              <li>
                <Link to="/policies" className="text-gray-200 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-200 hover:text-white transition">
                <Linkedin size={24} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-200 hover:text-white transition">
                <Youtube size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-200 hover:text-white transition">
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Newsletter</h3>
            <p className="text-gray-200">Stay updated with our latest news and updates.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
              <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-200">
            © {new Date().getFullYear()} AI Exchange Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
