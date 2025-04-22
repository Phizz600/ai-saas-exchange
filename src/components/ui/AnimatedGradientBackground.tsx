
import { ReactNode, useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

interface AnimatedGradientBackgroundProps {
  children: ReactNode;
}

const AnimatedGradientBackground = ({
  children
}: AnimatedGradientBackgroundProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    // Generate particles on component mount
    const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 5,
      duration: 15 + Math.random() * 10
    }));
    
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#13293D] via-[#16324F] to-[#0EA4E9] z-0">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map(particle => (
            <div 
              key={particle.id} 
              className="absolute rounded-full bg-white/10 backdrop-blur-sm animate-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 py-0 px-0 mx-0 my-[9px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style>
        {`
          @keyframes float-particle {
            0%, 100% { 
              transform: translateY(0) translateX(0); 
              opacity: 0.2; 
              scale: 1;
            }
            50% { 
              transform: translateY(-50px) translateX(${Math.random() * 30 - 15}px); 
              opacity: 0.5; 
              scale: 1.2;
            }
          }
          .animate-particle {
            animation-name: float-particle;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }
        `}
      </style>
    </div>
  );
};

export default AnimatedGradientBackground;
