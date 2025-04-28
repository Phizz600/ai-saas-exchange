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
      
    </footer>;
};