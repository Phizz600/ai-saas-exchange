import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

    if (tab_.onClick) {
      return (
        <Button
          key={tab_.title}
          variant="ghost"
          size="icon"
          onClick={tab_.onClick}
          className={cn(
            "hover:bg-gray-100",
            isActive && "bg-gray-100"
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{tab_.title}</span>
        </Button>
      );
    }

    return (
      <Link key={tab_.title} to={tab_.path || "#"}>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "hover:bg-gray-100",
            isActive && "bg-gray-100"
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{tab_.title}</span>
        </Button>
      </Link>
    );
  };

  return (
    <nav className="flex items-center gap-1">
      {tabs.map(renderTab)}
    </nav>
  );
};