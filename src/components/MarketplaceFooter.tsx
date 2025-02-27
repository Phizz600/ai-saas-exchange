
import { Link } from "react-router-dom";

export const MarketplaceFooter = () => {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Team", href: "/coming-soon" },
        { name: "Careers", href: "/coming-soon" },
        { name: "Blog", href: "/coming-soon" },
        { name: "Press", href: "/coming-soon" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/coming-soon" },
        { name: "FAQ", href: "/coming-soon" },
        { name: "Tutorials", href: "/coming-soon" },
        { name: "Resolution Center", href: "/resolution-center" },
        { name: "Community", href: "/coming-soon" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms", href: "/policies" },
        { name: "Privacy", href: "/policies" },
        { name: "Cookies", href: "/policies" },
        { name: "Licenses", href: "/policies" },
        { name: "Settings", href: "/policies" }
      ]
    },
    {
      title: "Social",
      links: [
        { name: "Twitter", href: "https://twitter.com" },
        { name: "LinkedIn", href: "https://linkedin.com" },
        { name: "Facebook", href: "https://facebook.com" },
        { name: "Instagram", href: "https://instagram.com" },
        { name: "Github", href: "https://github.com" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-base text-gray-500 hover:text-gray-900"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} AI Exchange Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
