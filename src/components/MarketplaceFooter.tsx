import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const MarketplaceFooter = () => {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent2 to-accent3">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
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
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <img 
              src="/lovable-uploads/c2d95fc3-b2b8-41f4-bee8-877a1d72cf6c.png"
              alt="AI Exchange Club"
              className="h-16 w-auto mb-6"
            />
            <p className="text-white">
              Your premier destination for AI product trading and innovation.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-white">Company</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white">Contact</Link>
              </li>
              <li>
                <Link to="/careers" className="text-white/80 hover:text-white">Careers</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-white">Resources</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/blog" className="text-white/80 hover:text-white">Blog</Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/80 hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/80 hover:text-white">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-white">Follow Us</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-white/80 hover:text-white">Facebook</Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white">Twitter</Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white">Instagram</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};