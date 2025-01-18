import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const MarketplaceFAQ = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 bg-white">
      <h2 className="text-3xl font-semibold text-center mb-12">General FAQ's</h2>
      <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left text-lg font-medium">
            What can I sell?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            You can sell digital assets and online businesses. This includes SaaS assets, apps, eCommerce, blogs, communities and plugins.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left text-lg font-medium">
            How much does it cost to sell with AI Exchange Club?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            We charge a small commission fee only when your asset successfully sells. The exact percentage depends on the final sale price and includes all transaction handling and escrow services.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left text-lg font-medium">
            How long does it take to sell?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            The selling timeline varies depending on factors like pricing, market conditions, and asset quality. Most assets sell within 30-90 days when priced appropriately.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left text-lg font-medium">
            How should I price my asset / online business?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            Pricing typically depends on factors like monthly revenue, growth rate, tech stack, and market potential. Our team can help you determine a competitive price based on market data and recent sales.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="text-left text-lg font-medium">
            What information do I need to verify?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            We require verification of revenue claims, traffic analytics, and ownership documentation. This helps maintain trust and transparency in our marketplace.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};