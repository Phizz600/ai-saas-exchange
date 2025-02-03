import { cn } from "@/lib/utils";

interface FormProgressBarProps {
  currentSection: number;
  onSectionClick: (index: number) => void;
}

export function FormProgressBar({ currentSection, onSectionClick }: FormProgressBarProps) {
  const sections = [
    "Basics",
    "Financials",
    "Technical",
    "Traffic & Users",
    "Dutch Auction"
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {sections.map((section, index) => (
          <button
            key={section}
            onClick={() => onSectionClick(index)}
            className={cn(
              "text-sm font-medium transition-colors",
              currentSection >= index ? "text-primary" : "text-gray-400",
              "hover:text-primary/80"
            )}
          >
            {section}
          </button>
        ))}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] rounded-full transition-all duration-300"
          style={{ width: `${(currentSection + 1) * 20}%` }}
        />
      </div>
    </div>
  );
}