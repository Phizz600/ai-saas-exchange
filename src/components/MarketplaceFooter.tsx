
import { Link } from "react-router-dom";

export const MarketplaceFooter = () => {
  const footerLinks = [{
    title: "Company",
    links: [{
      name: "About",
      href: "/about"
    }, {
      name: "Team",
      href: "/coming-soon"
    }, {
      name: "Blog",
      href: "/coming-soon"
    }, {
      name: "Press",
      href: "/coming-soon"
    }]
  }, {
    title: "Resources",
    links: [{
      name: "Documentation",
      href: "/coming-soon"
    }, {
      name: "FAQ",
      href: "/coming-soon"
    }, {
      name: "Tutorials",
      href: "/coming-soon"
    }, {
      name: "Resolution Center",
      href: "/resolution-center"
    }, {
      name: "Community",
      href: "/coming-soon"
    }]
  }, {
    title: "Legal",
    links: [{
      name: "Terms",
      href: "/policies"
    }, {
      name: "Privacy",
      href: "/policies"
    }, {
      name: "Cookies",
      href: "/policies"
    }, {
      name: "Licenses",
      href: "/policies"
    }, {
      name: "Settings",
      href: "/policies"
    }]
  }, {
    title: "Social",
    links: [{
      name: "Twitter",
      href: "https://twitter.com"
    }, {
      name: "LinkedIn",
      href: "https://linkedin.com"
    }, {
      name: "Facebook",
      href: "https://facebook.com"
    }, {
      name: "Instagram",
      href: "https://instagram.com"
    }, {
      name: "Github",
      href: "https://github.com"
    }]
  }];
  
  return <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-800 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href}
                      className="text-gray-600 hover:text-[#8B5CF6] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
          <p>© {new Date().getFullYear()} AI Exchange Club. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
