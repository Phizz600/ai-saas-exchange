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
      name: "Careers",
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
      
    </footer>;
};