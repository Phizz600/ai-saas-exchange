
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FAQAccordionItem } from "@/components/faq/FAQAccordionItem";
import type { FAQCategory } from "@/data/faqCategoryData";

interface FAQCategorySectionProps {
  category: FAQCategory;
  searchQuery: string;
}

export const FAQCategorySection = ({ category, searchQuery }: FAQCategorySectionProps) => {
  // Filter items based on search query
  const filteredItems = searchQuery
    ? category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof item.answer === 'string' && 
           item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : category.items;

  // If no items match search and we have a search query, don't render section
  if (searchQuery && filteredItems.length === 0) {
    return null;
  }

  const Icon = category.icon;

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">{category.title}</CardTitle>
            <CardDescription className="text-white/70">{category.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="space-y-4">
          {filteredItems.map((item) => (
            <FAQAccordionItem key={item.id} item={item} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
