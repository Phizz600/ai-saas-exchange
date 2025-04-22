
import { Search } from "lucide-react";
import { useState } from "react";

interface FAQHeroProps {
  onSearch: (query: string) => void;
}

export const FAQHero = ({ onSearch }: FAQHeroProps) => {
  const [searchInput, setSearchInput] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };
  
  return (
    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white exo-2-heading">
        Frequently Asked Questions
      </h1>
      <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
        Find answers to common questions about our platform, buying and selling AI products, and more.
      </p>
      
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for answers..."
            className="w-full py-3 px-5 pl-12 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D946EE]/50 focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
          
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onSearch("");
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90"
            >
              ✕
            </button>
          )}
        </div>
        
        <button
          type="submit"
          className="mt-4 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white font-medium py-2 px-6 rounded-full hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </form>
    </div>
  );
};
