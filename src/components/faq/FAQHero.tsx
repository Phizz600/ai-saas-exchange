
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FAQHeroProps {
  onSearch: (query: string) => void;
}

export const FAQHero = ({ onSearch }: FAQHeroProps) => {
  const [searchValue, setSearchValue] = useState("");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };
  
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="exo-2-heading text-4xl md:text-5xl font-bold text-white mb-6">
        Answers to Your Questions
      </h1>
      <p className="text-xl text-white/80 mb-8">
        Find answers to common questions about buying and selling AI tools on our platform
      </p>
      
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search for answers..."
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-10 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm rounded-lg w-full focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
        />
      </div>
      
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/80">
          <span className="font-medium">500+</span> Successful Transactions
        </div>
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/80">
          <span className="font-medium">24/7</span> Support
        </div>
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/80">
          <span className="font-medium">100%</span> Secure Escrow
        </div>
      </div>
    </div>
  );
};
