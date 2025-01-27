import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Tab {
  title: string;
  icon: any;
  description?: string;
  path?: string;
  onClick?: () => void;
}

interface Separator {
  type: "separator";
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
}

export const ExpandableTabs = ({ tabs }: ExpandableTabsProps) => {
  const location = useLocation();

  const renderTab = (tab: TabItem) => {
    if ('type' in tab && tab.type === 'separator') {
      return <div key={Math.random()} className="w-px h-6 bg-gray-200" />;
    }

    const tab_ = tab as Tab;
    const Icon = tab_.icon;
    const isActive = tab_.path === location.pathname;

    const button = (
      <Button
        variant="ghost"
        className={cn(
          "h-12 w-12 rounded-full hover:bg-gray-100 bg-white",
          isActive && "bg-gray-100"
        )}
        onClick={tab_.onClick}
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{tab_.title}</span>
      </Button>
    );

    return (
      <TooltipProvider key={tab_.title}>
        <Tooltip>
          <TooltipTrigger asChild>
            {tab_.onClick ? (
              button
            ) : (
              <Link to={tab_.path || "#"}>
                {button}
              </Link>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tab_.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <nav className="flex items-center gap-1 bg-gray-50 p-2 rounded-full">
      {tabs.map(renderTab)}
    </nav>
  );
};