import { Youtube, Instagram, Rss } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const socialLinks = [
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Rss, href: "#", label: "Beehiiv" },
  ];

  return (
    <footer className="relative w-full py-8 bg-transparent">
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