
import { cn } from "@/lib/utils";
import { Archive, DollarSign, LineChart, Receipt, Settings, User } from "lucide-react";

interface FormProgressBarProps {
  currentSection: number;
  onSectionClick: (section: number) => void;
}

interface Section {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
}

const sections: Section[] = [
  { id: 0, title: "Basics", icon: User },
  { id: 1, title: "Financials", icon: DollarSign },
  { id: 2, title: "Technical", icon: Settings },
  { id: 3, title: "Traffic & Users", icon: LineChart },
  { id: 4, title: "Special Notes", icon: Archive },
  { id: 5, title: "Selling Method", icon: Receipt },
];

export function FormProgressBar({ currentSection, onSectionClick }: FormProgressBarProps) {
  const handleClick = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    e.stopPropagation(); // Stop event bubbling
    onSectionClick(index);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          const isActive = currentSection >= index;
          
          return (
            <button
              key={section.id}
              onClick={handleClick(index)}
              type="button" // Explicitly set button type to prevent form submission
              className={cn(
                "flex flex-col items-center gap-1 md:gap-2 relative z-10",
                isActive ? "text-[#8B5CF6]" : "text-gray-400"
              )}
            >
              {/* Circle indicator - smaller on mobile */}
              <div
                className={cn(
                  "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all",
                  isActive ? "bg-[#8B5CF6] text-white" : "bg-gray-200"
                )}
              >
                {/* Show icon for both mobile and desktop, but smaller on mobile */}
                <IconComponent className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              
              {/* Title - hidden on mobile */}
              <span className="text-xs font-medium hidden md:block">
                {section.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress bar - adjusted for mobile */}
      <div className="absolute top-3 md:top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
        <div
          className="h-full bg-[#8B5CF6] transition-all duration-300"
          style={{
            width: `${(currentSection / (sections.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
