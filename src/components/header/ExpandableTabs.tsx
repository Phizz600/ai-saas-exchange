
import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Tab {
  title: string;
  icon: LucideIcon;
  description?: string;
  path?: string;
  onClick?: () => void;
  indicator?: boolean;
}

interface Separator {
  type: "separator";
}

type TabItem = Tab | Separator;

interface Props {
  tabs: TabItem[];
}

export const ExpandableTabs = ({ tabs }: Props) => {
  const navigate = useNavigate();

  const handleClick = (tab: Tab) => {
    if (tab.onClick) {
      tab.onClick();
    } else if (tab.path) {
      navigate(tab.path);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {tabs.map((tab, index) => {
        if ('type' in tab && tab.type === 'separator') {
          return (
            <div key={index} className="w-px h-6 bg-gray-200 mx-2" />
          );
        }

        const tabItem = tab as Tab;
        const Icon = tabItem.icon;

        return (
          <div key={index} className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick(tabItem)}
                    className="relative w-10 h-10 p-2"
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tabItem.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {tabItem.indicator && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
};
