import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { type FAQItem as FAQItemType } from "@/data/faqData";

interface FAQItemProps {
  item: FAQItemType;
}

export const FAQItem = ({ item }: FAQItemProps) => {
  return (
    <AccordionItem 
      value={item.id} 
      className="border rounded-lg px-6 py-2 shadow-sm hover:shadow-md transition-shadow bg-white"
    >
      <AccordionTrigger className="text-left text-lg font-medium hover:text-primary transition-colors">
        {item.question}
      </AccordionTrigger>
      <AccordionContent className="text-gray-600 space-y-2 pt-4">
        {Array.isArray(item.answer) ? (
          <ul className="list-disc pl-6 space-y-2">
            {item.answer.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        ) : (
          item.answer
        )}
      </AccordionContent>
    </AccordionItem>
  );
};