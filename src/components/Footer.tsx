import { Youtube, Instagram, Rss } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const Footer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const socialLinks = [
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Rss, href: "#", label: "Beehiiv" },
  ];

  return (
    <footer className="relative w-full py-8 bg-transparent">
      {/* Glowing cursor effect */}
      <div
        className="fixed pointer-events-none w-[150px] h-[150px] rounded-full blur-[80px] bg-white/30 transition-all duration-200"
        style={{
          left: `${mousePosition.x - 75}px`,
          top: `${mousePosition.y - 75}px`,
          animation: "pulse 3s ease-in-out infinite",
        }}
      />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex items-center space-x-6">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                to={href}
                className="text-white/60 hover:text-white transition-colors duration-200"
                aria-label={label}
              >
                <Icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} AI Exchange Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};