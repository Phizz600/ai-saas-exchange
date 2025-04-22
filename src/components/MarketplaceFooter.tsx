
import { Link } from "react-router-dom";
import { Linkedin, Instagram } from "lucide-react";

export const MarketplaceFooter = () => {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Team", href: "/coming-soon" },
        { name: "Blog", href: "/coming-soon" },
        { name: "Press", href: "/coming-soon" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/coming-soon" },
        { name: "FAQ", href: "/faq" },
        { name: "Tutorials", href: "/coming-soon" },
        { name: "Resolution Center", href: "/resolution-center" },
        { name: "Community", href: "/coming-soon" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms", href: "/terms" },
        { name: "Privacy", href: "/policies" },
        { name: "Cookies", href: "/policies" },
        { name: "Licenses", href: "/policies" },
        { name: "Settings", href: "/policies" }
      ]
    },
    {
      title: "Social",
      links: [
        { name: "LinkedIn", href: "https://www.linkedin.com/company/ai-exchange-club/?viewAsMember=true", isExternal: true },
        { name: "Instagram", href: "https://www.instagram.com/aiexchange.club/?igsh=MWt0bTg1eG5iZzM1Mw%3D%3D&utm_source=qr#", isExternal: true }
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.isExternal ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link to={link.href} className="text-gray-600 hover:text-gray-900 transition-colors">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} AI Exchange Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
