
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FAQCategorySection } from "@/components/faq/FAQCategorySection";
import { FAQHero } from "@/components/faq/FAQHero";
import { FAQConversionCTA } from "@/components/faq/FAQConversionCTA";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { faqCategories } from "@/data/faqCategoryData";
import { FAQNoResults } from "@/components/faq/FAQNoResults";
import { LiveChatButton } from "@/components/LiveChatButton";

export const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasResults, setHasResults] = useState(true);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Check if any FAQs match the search query
  useEffect(() => {
    if (!searchQuery) {
      setHasResults(true);
      return;
    }

    const anyMatches = faqCategories.some(category => 
      category.items.some(
        item => 
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof item.answer === 'string' && 
           item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
    
    setHasResults(anyMatches);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-accent2">
      <PromotionalBanner />
      <Navbar />
      <div className="container mx-auto px-4 py-12 mt-24">
        <FAQHero onSearch={handleSearch} />
        
        {searchQuery && !hasResults ? (
          <FAQNoResults searchQuery={searchQuery} onClearSearch={clearSearch} />
        ) : (
          <div className="max-w-5xl mx-auto mt-16 space-y-12">
            {faqCategories.map((category) => (
              <FAQCategorySection 
                key={category.id} 
                category={category} 
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
        
        <FAQConversionCTA />
      </div>
      <Footer />
      <LiveChatButton />
    </div>
  );
};

export default FAQ;
