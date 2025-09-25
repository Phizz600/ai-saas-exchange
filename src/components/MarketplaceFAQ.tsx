import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { FAQItem } from "@/components/marketplace/FAQItem";
import { faqData } from "@/data/faqData";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
export const MarketplaceFAQ = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedFAQs = showAll ? faqData : faqData.slice(0, 3);
  return <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 bg-gradient-to-b from-white via-gray-50 to-gray-100 border-t border-gray-200 rounded-xl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-4xl font-exo font-bold text-center mb-4 text-[#111827] animate-fade-in">
            General FAQ's
          </h2>
          <p className="text-gray-600 text-center mb-12 animate-fade-in">
            Find answers to commonly asked questions about AI Exchange Club
          </p>
          
          <Accordion type="single" collapsible className="w-full space-y-6">
            {displayedFAQs.map(faq => <FAQItem key={faq.id} item={faq} />)}
          </Accordion>

          {faqData.length > 3 && <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => setShowAll(!showAll)} className="gap-2">
                {showAll ? <>
                    Show Less <ChevronUp className="h-4 w-4" />
                  </> : <>
                    Load More <ChevronDown className="h-4 w-4" />
                  </>}
              </Button>
            </div>}
        </div>
      </div>
    </div>;
};