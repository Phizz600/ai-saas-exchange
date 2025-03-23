
import { useState } from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { FAQItem } from "@/data/faqCategoryData";

interface FAQAccordionItemProps {
  item: FAQItem;
}

export const FAQAccordionItem = ({ item }: FAQAccordionItemProps) => {
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  
  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(true);
    
    // In a real implementation, you would send this to your analytics or feedback system
    console.log(`Feedback for FAQ "${item.id}": ${helpful ? 'Helpful' : 'Not Helpful'}`);
    
    toast({
      title: helpful ? "Thanks for your feedback!" : "We'll improve this answer",
      description: helpful 
        ? "We're glad this was helpful." 
        : "Thank you for letting us know. We'll work on making this answer better.",
    });
  };
  
  return (
    <AccordionItem value={item.id} className="border border-white/10 rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-4 text-white hover:text-[#D946EE] transition-colors font-medium text-left">
        {item.question}
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-6 pt-2 text-white/90">
        <div className="mb-4">
          {Array.isArray(item.answer) ? (
            <ul className="list-disc pl-5 space-y-3">
              {item.answer.map((point, index) => (
                <li key={index} className="text-left">{point}</li>
              ))}
            </ul>
          ) : (
            <div className="text-left whitespace-pre-line">{item.answer}</div>
          )}
        </div>
        
        {!feedbackGiven ? (
          <div className="mt-4 pt-3 border-t border-white/10 text-sm flex items-center">
            <span className="text-white/60 mr-3">Was this helpful?</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleFeedback(true)}
              className="text-white/80 hover:text-[#D946EE] hover:bg-white/5"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Yes
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleFeedback(false)}
              className="text-white/80 hover:text-[#D946EE] hover:bg-white/5"
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              No
            </Button>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-white/10 text-sm text-white/60">
            Thank you for your feedback!
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
