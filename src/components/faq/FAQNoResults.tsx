
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQNoResultsProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export const FAQNoResults = ({ searchQuery, onClearSearch }: FAQNoResultsProps) => {
  return (
    <div className="max-w-2xl mx-auto mt-16 text-center">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-500/20 text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">No results found</h2>
        
        <p className="text-white/70 mb-6">
          We couldn't find any FAQ entries matching "<span className="font-medium text-white">{searchQuery}</span>".
          Try different keywords or browse through our categories below.
        </p>
        
        <Button onClick={onClearSearch} className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white hover:opacity-90">
          Clear Search
        </Button>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-white/60 text-sm">
            If you still can't find what you're looking for, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};
