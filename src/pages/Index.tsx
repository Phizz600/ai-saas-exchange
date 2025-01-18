import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-accent2">
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {[
            "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
            "https://images.unsplash.com/photo-1518770660439-4636190af475",
            "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
          ].map((img, index) => (
            <motion.img
              key={index}
              src={`${img}?auto=format&fit=crop&w=300&q=60`}
              alt=""
              className="w-full h-48 object-cover rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            />
          ))}
        </div>
      </div>
      <Navbar />
      <main className="relative z-10">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Index;