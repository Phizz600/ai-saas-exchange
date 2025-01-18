import { Accordion } from "@/components/ui/accordion";
import { FAQItem } from "@/components/marketplace/FAQItem";
import { faqData } from "@/data/faqData";

export const MarketplaceFAQ = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
          General FAQ's
        </h2>
        <p className="text-gray-600 text-center mb-12 animate-fade-in">
          Find answers to commonly asked questions about AI Exchange Club
        </p>
        
        <Accordion type="single" collapsible className="w-full space-y-6">
          {faqData.map((faq) => (
            <FAQItem key={faq.id} item={faq} />
          ))}
        </Accordion>
      </div>
    </div>
  );
};