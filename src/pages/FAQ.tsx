
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FAQCategorySection } from "@/components/faq/FAQCategorySection";
import { FAQSearch } from "@/components/faq/FAQSearch";
import { FAQHero } from "@/components/faq/FAQHero";
import { FAQConversionCTA } from "@/components/faq/FAQConversionCTA";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { faqCategories } from "@/data/faqCategoryData";

export const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-accent2">
      <PromotionalBanner />
      <Navbar />
      <div className="container mx-auto px-4 py-12 mt-24">
        <FAQHero onSearch={handleSearch} />
        
        <div className="max-w-5xl mx-auto mt-16 space-y-12">
          {faqCategories.map((category) => (
            <FAQCategorySection 
              key={category.id} 
              category={category} 
              searchQuery={searchQuery}
            />
          ))}
        </div>
        
        <FAQConversionCTA />
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
