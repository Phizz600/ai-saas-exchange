import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, User, Store, MessageCircle, Bell, Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Custom hook for outside click
const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: Event) => void) => {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// Animation variants
const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem"
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? "0.5rem" : 0,
    paddingLeft: isSelected ? "0.75rem" : "0.5rem",
    paddingRight: isSelected ? "0.75rem" : "0.5rem"
  })
};

// Motion components (simplified animations)
interface MotionButtonProps {
  children: React.ReactNode;
  variants: typeof buttonVariants;
  custom: boolean;
  onClick: () => void;
  className: string;
}
const MotionButton = ({
  children,
  variants,
  custom,
  onClick,
  className
}: MotionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 600);
  };
  const animatedStyle = variants.animate(custom);
  return <button onClick={handleClick} className={className} style={{
    gap: animatedStyle.gap,
    paddingLeft: animatedStyle.paddingLeft,
    paddingRight: animatedStyle.paddingRight,
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  }}>
      {children}
    </button>;
};
interface MotionSpanProps {
  children: React.ReactNode;
  isVisible: boolean;
}
const MotionSpan = ({
  children,
  isVisible
}: MotionSpanProps) => {
  return <span className="overflow-hidden transition-all duration-600 ease-out" style={{
    width: isVisible ? 'auto' : '0px',
    opacity: isVisible ? 1 : 0,
    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  }}>
      {children}
    </span>;
};
interface Tab {
  title: string;
  icon: React.ElementType;
  path?: string;
  onClick?: () => void;
}
export default function ExpandableTabs() {
  const [selected, setSelected] = useState<number | null>(null);
  const outsideClickRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();

  // Sample tabs data
  const tabs: Tab[] = [{
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/product-dashboard"
  }, {
    title: "Profile",
    icon: User,
    path: "/profile"
  }, {
    title: "Marketplace",
    icon: Store,
    path: "/marketplace"
  }, {
    title: "List Business",
    icon: Plus,
    path: "/list-product"
  }, {
    title: "Messages",
    icon: MessageCircle,
    path: "/messages"
  }, {
    title: "Notifications",
    icon: Bell,
    onClick: () => console.log("Notifications clicked")
  }];

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed out successfully",
          description: "You have been signed out of your account."
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  // Set selected tab based on current route
  useEffect(() => {
    const currentTab = tabs.findIndex(tab => tab.path === location.pathname);
    if (currentTab !== -1) {
      setSelected(currentTab);
    }
  }, [location.pathname]);
  useOnClickOutside(outsideClickRef, () => {
    setSelected(null);
  });
  const handleSelect = (index: number) => {
    const tab = tabs[index];
    setSelected(index);
    if (tab.onClick) {
      tab.onClick();
    } else if (tab.path) {
      navigate(tab.path);
    }
  };
  return <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
      <div ref={outsideClickRef} className="flex items-center justify-between w-full max-w-4xl gap-1 sm:gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-1 sm:p-1.5 shadow-lg overflow-hidden py-[7px] my-[30px]">
        {/* Main navigation tabs - scrollable on mobile */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
          {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isSelected = selected === index;
          return <MotionButton key={tab.title} variants={buttonVariants} custom={isSelected} onClick={() => handleSelect(index)} className={`
                  relative flex items-center rounded-xl py-2.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors duration-300 min-h-[44px] touch-manipulation flex-shrink-0
                  ${isSelected ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white active:bg-white/15"}
                `}>
                <Icon size={16} className="sm:w-5 sm:h-5" />
                <MotionSpan isVisible={isSelected}>
                  {tab.title}
                </MotionSpan>
              </MotionButton>;
        })}
        </div>
        
        {/* Sign out button - always visible on far right */}
        <div className="flex-shrink-0 ml-2">
          <button onClick={handleSignOut} className="
              relative flex items-center justify-center rounded-xl py-2.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium transition-colors duration-300 min-h-[44px] min-w-[44px] touch-manipulation
              text-white/70 hover:bg-red-500/20 hover:text-red-300 active:bg-red-500/30
            " title="Sign Out" aria-label="Sign Out">
            <LogOut size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>;
}