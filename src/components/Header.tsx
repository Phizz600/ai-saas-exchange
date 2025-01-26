import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ExpandableTabs } from "./header/ExpandableTabs";
import { ProfileMenu } from "./header/ProfileMenu";
import { Home, Store, LayoutDashboard } from "lucide-react";

export const Header = () => {
  const location = useLocation();
  const isMarketplace = location.pathname === '/marketplace';

  const navigationTabs = [
    {
      title: "Home",
      icon: Home,
      description: "Go to homepage"
    },
    {
      title: "Marketplace",
      icon: Store,
      description: "Browse AI products"
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      description: "View your dashboard"
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isMarketplace && (
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/410d1e6b-e7e7-499e-a8f7-9bf6bda5e131.png" 
                  alt="AI Exchange Logo" 
                  className="h-10 w-10"
                />
              </Link>
            )}
            <ExpandableTabs tabs={navigationTabs} />
          </div>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};