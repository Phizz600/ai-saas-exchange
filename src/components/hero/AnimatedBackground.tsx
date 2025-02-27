
import { motion } from "framer-motion";

const AnimatedBackground = () => {
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 15 + 5,
    duration: Math.random() * 20 + 25, // Longer duration for smoother movement
    delay: Math.random() * -20, // Random start time to prevent synchronization
    yOffset: Math.random() * 100 - 50, // Random vertical movement range
    xOffset: Math.random() * 100 - 50, // Random horizontal movement range
  }));

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent2 to-accent3 animate-gradient">
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-white/30 to-transparent backdrop-blur-sm"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [
                  particle.y, 
                  particle.y + particle.yOffset, 
                  particle.y
                ],
                x: [
                  particle.x, 
                  particle.x + particle.xOffset, 
                  particle.x
                ],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] opacity-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>
    </>
  );
};

export default AnimatedBackground;
