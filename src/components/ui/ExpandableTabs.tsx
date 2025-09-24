import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, User, Store, MessageCircle, Bell, Plus } from "lucide-react";

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
    paddingRight: "0.5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? "0.5rem" : 0,
    paddingLeft: isSelected ? "1rem" : "0.5rem",
    paddingRight: isSelected ? "1rem" : "0.5rem",
  }),
};

// Motion components (simplified animations)
interface MotionButtonProps {
  children: React.ReactNode;
  variants: typeof buttonVariants;
  custom: boolean;
  onClick: () => void;
  className: string;
}

const MotionButton = ({ children, variants, custom, onClick, className }: MotionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 600);
  };

  const animatedStyle = variants.animate(custom);
  
  return (
    <button
      onClick={handleClick}
      className={className}
      style={{
        gap: animatedStyle.gap,
        paddingLeft: animatedStyle.paddingLeft,
        paddingRight: animatedStyle.paddingRight,
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </button>
  );
};

interface MotionSpanProps {
  children: React.ReactNode;
  isVisible: boolean;
}

const MotionSpan = ({ children, isVisible }: MotionSpanProps) => {
  return (
    <span 
      className="overflow-hidden transition-all duration-600 ease-out"
      style={{
        width: isVisible ? 'auto' : '0px',
        opacity: isVisible ? 1 : 0,
        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </span>
  );
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

  // Sample tabs data
  const tabs: Tab[] = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/product-dashboard" },
    { title: "Profile", icon: User, path: "/profile" },
    { title: "Marketplace", icon: Store, path: "/marketplace" },
    { title: "List Business", icon: Plus, path: "/list-business" },
    { title: "Messages", icon: MessageCircle, path: "/messages" },
    { title: "Notifications", icon: Bell, onClick: () => console.log("Notifications clicked") },
  ];

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

  return (
    <div className="flex justify-center mb-8">
      <div
        ref={outsideClickRef}
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-1 shadow-lg"
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isSelected = selected === index;

          return (
            <MotionButton
              key={tab.title}
              variants={buttonVariants}
              custom={isSelected}
              onClick={() => handleSelect(index)}
              className={`
                relative flex items-center rounded-xl py-2 text-sm font-medium transition-colors duration-300
                ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <Icon size={20} />
              <MotionSpan isVisible={isSelected}>
                {tab.title}
              </MotionSpan>
            </MotionButton>
          );
        })}
      </div>
    </div>
  );
}