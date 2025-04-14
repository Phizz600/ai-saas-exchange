import { motion } from "framer-motion";
import { memo, useCallback } from "react";
interface AnimatedGradientBackgroundProps {
  children: React.ReactNode;
}
const AnimatedGradientBackground = ({
  children
}: AnimatedGradientBackgroundProps) => {
  // Create particles with memoized callback to prevent unnecessary re-renders
  const renderParticles = useCallback(() => {
    return Array.from({
      length: 30
    }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 5,
      duration: 15 + Math.random() * 10 // Increased duration for smoother movement
    }));
  }, []);
  const particles = renderParticles();
  return <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#13293D] via-[#16324F] to-[#0EA4E9] z-0">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map(particle => <motion.div key={particle.id} className="absolute rounded-full bg-white/10 backdrop-blur-sm" style={{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: particle.size,
          height: particle.size
        }} animate={{
          y: [0, -50, 0],
          x: [0, Math.random() * 30 - 15, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1]
        }} transition={{
          duration: particle.duration,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1] // Ensure smooth transitions between states
        }} />)}
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 py-0 px-0 mx-0 my-[9px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>;
};

// Memoize to prevent re-renders
export default memo(AnimatedGradientBackground);