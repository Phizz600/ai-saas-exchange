
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu } from "lucide-react";

interface Tab {
  title: string;
  icon: React.ElementType;
  description?: string;
  path?: string;
  onClick?: () => void;
  indicator?: boolean;
  badge?: number;
}

interface Separator {
  type: "separator";
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
}

export const ExpandableTabs = ({ tabs }: ExpandableTabsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (tab: Tab) => {
    if (tab.onClick) {
      tab.onClick();
    } else if (tab.path) {
      navigate(tab.path);
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center rounded-md p-2.5 text-sm font-medium hover:bg-gray-100 focus:outline-none"
        >
          <Menu className="h-5 w-5 mr-1" />
          {/* Ensure the ChevronDown arrow is always present */}
          <ChevronDown className="h-4 w-4 ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border border-gray-200">
        {tabs.map((item, index) => {
          if ('type' in item && item.type === 'separator') {
            return <DropdownMenuSeparator key={`sep-${index}`} />;
          }
          
          const tab = item as Tab;
          const Icon = tab.icon;
          
          return (
            <DropdownMenuItem
              key={tab.title}
              className="cursor-pointer px-3 py-2.5"
              onClick={() => handleTabClick(tab)}
            >
              <div className="flex items-center">
                <div className="relative">
                  <Icon className="mr-2 h-5 w-5" />
                  {tab.indicator && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>
                <span>{tab.title}</span>
                {tab.badge !== undefined && (
                  <Badge 
                    variant="destructive" 
                    className="ml-2"
                  >
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
