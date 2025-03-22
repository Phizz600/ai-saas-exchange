
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FAQSearchProps {
  onSearch: (query: string) => void;
}

export const FAQSearch = ({ onSearch }: FAQSearchProps) => {
  const [searchValue, setSearchValue] = useState("");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };
  
  const clearSearch = () => {
    setSearchValue("");
    onSearch("");
  };
  
  return (
    <div className="relative max-w-2xl mx-auto mb-12">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search for answers..."
        value={searchValue}
        onChange={handleSearchChange}
        className="pl-10 pr-10 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm rounded-lg w-full focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
      />
      {searchValue && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
