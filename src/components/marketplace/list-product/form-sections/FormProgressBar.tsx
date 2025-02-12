
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
    "Special Notes",
    "Selling Method"
  ];

  const handleSectionClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault(); // Prevent form submission
    onSectionClick(index);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {sections.map((section, index) => (
          <button
            key={section}
            onClick={(e) => handleSectionClick(e, index)}
            type="button"
            className={cn(
              "text-sm font-medium transition-colors",
              currentSection === index ? "text-primary" : 
              currentSection > index ? "text-primary/80" : "text-gray-400",
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
          style={{ width: `${((currentSection) / (sections.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
