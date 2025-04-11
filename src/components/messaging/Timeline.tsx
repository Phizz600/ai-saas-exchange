
import { ReactNode } from "react";

export interface TimelineItem {
  title: string;
  description: string;
  timestamp: string;
  icon: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-4 relative">
      {/* Vertical line */}
      <div className="absolute top-0 left-3.5 bottom-0 w-px bg-gray-200"></div>
      
      {items.map((item, index) => (
        <div key={index} className="relative pl-10">
          {/* Icon with background */}
          <div className="absolute left-0 p-1 rounded-full bg-white border border-gray-200 z-10">
            {item.icon}
          </div>
          
          {/* Content */}
          <div>
            <h4 className="text-sm font-medium">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
