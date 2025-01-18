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
      <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto space-y-4">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left text-lg font-medium">
            Why buy on AI Exchange Club?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 space-y-2">
            <ul className="list-disc pl-4 space-y-2">
              <li>Access exclusive deals: Discover unique and promising AI SaaS opportunities not found elsewhere.</li>
              <li>Benefit from competitive bidding: Participate in exciting auctions and secure the best deals.</li>
              <li>Leverage expert insights: Gain access to valuable data, market analysis, and industry trends.</li>
              <li>Connect with a thriving community: Network with other investors, entrepreneurs, and industry leaders.</li>
              <li>Streamlined acquisition process: Efficiently navigate the M&A process with our user-friendly platform.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left text-lg font-medium">
            Why sell on AI Exchange Club?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 space-y-2">
            <ul className="list-disc pl-4 space-y-2">
              <li>Maximize your returns: Using our timed auction-based sales platform, AI innovators are able to get the highest amount possible for their AI products or working MVP models.</li>
              <li>Reach a targeted audience: Gain exposure to a highly engaged community of investors, acquirers, and industry professionals actively seeking innovative AI solutions.</li>
              <li>Access to valuable resources: Leverage our free AI valuation tool, expert insights, and community support to make informed decisions.</li>
              <li>Streamlined listing process: Easily list your AI product with our user-friendly platform and reach a global audience.</li>
              <li>Benefit from our marketing efforts: Gain visibility through our featured product section and targeted marketing campaigns.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left text-lg font-medium">
            What is the membership fee for the platform?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            The membership fee is $20 per month for both buyers and sellers.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left text-lg font-medium">
            How does the listing process work?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            Sellers can list their AI SaaS products on the platform by providing key details, uploading pitch decks, and selecting a selling method (fixed price or auction). A $100 listing fee applies.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="text-left text-lg font-medium">
            What is the commission structure?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            We charge a 1-3% commission on the successful sale of an AI SaaS company.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger className="text-left text-lg font-medium">
            What payment methods are accepted?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            We currently accept payments through Escrow.com, a secure third-party payment processor, to ensure safe and transparent transactions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger className="text-left text-lg font-medium">
            How does the bidding process work?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            Most listings will use a timed auction format. Buyers can place bids, and the highest bidder at the end of the auction period typically wins.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger className="text-left text-lg font-medium">
            What is the purpose of the "Hot Deals" section?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            The "Hot Deals" section highlights companies with high view/click rates on their pitch decks or those generating significant bidding activity, making them attractive investment opportunities.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9">
          <AccordionTrigger className="text-left text-lg font-medium">
            How can I contact other users on the platform?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            You can contact other users through the platform's messaging system to inquire about listings, discuss deals, or exchange information.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10">
          <AccordionTrigger className="text-left text-lg font-medium">
            Is there a refund policy for membership fees?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            No refunds for monthly memberships. Refunds for listing fees may be considered under certain circumstances.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-11">
          <AccordionTrigger className="text-left text-lg font-medium">
            What happens if I encounter a problem or have a question?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">
            You can visit our contact us page or use the live chat feature for immediate assistance. Our support team is happy to help!
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};