
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
      <AccordionContent className="px-4 pb-6 pt-2 text-white/90">
        {Array.isArray(item.answer) ? (
          <ul className="list-disc pl-5 space-y-3">
            {item.answer.map((point, index) => (
              <li key={index} className="text-left">{point}</li>
            ))}
          </ul>
        ) : (
          <div className="text-left whitespace-pre-line">{item.answer}</div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
