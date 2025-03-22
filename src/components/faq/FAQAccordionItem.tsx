
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { FAQItem } from "@/data/faqCategoryData";

interface FAQAccordionItemProps {
  item: FAQItem;
}

export const FAQAccordionItem = ({ item }: FAQAccordionItemProps) => {
  return (
    <AccordionItem value={item.id} className="border border-white/10 rounded-lg overflow-hidden">
      <AccordionTrigger className="px-4 py-4 text-white hover:text-[#D946EE] transition-colors font-medium text-left">
        {item.question}
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-2 text-white/80">
        {Array.isArray(item.answer) ? (
          <ul className="list-disc pl-5 space-y-2">
            {item.answer.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        ) : (
          <p>{item.answer}</p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
