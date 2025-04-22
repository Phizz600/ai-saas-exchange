import { Link } from "react-router-dom";
import { Linkedin, Instagram } from "lucide-react";
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
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/ai-exchange-club/?viewAsMember=true",
      isExternal: true
    }, {
      name: "Instagram",
      href: "https://www.instagram.com/aiexchange.club/?igsh=MWt0bTg1eG5iZzM1Mw%3D%3D&utm_source=qr#",
      isExternal: true
    }]
  }];
  return <footer className="bg-gray-50 border-t border-gray-200">
      
    </footer>;
};