export type FAQItem = {
  id: string;
  question: string;
  answer: string | string[];
};

export const faqData: FAQItem[] = [
  {
    id: "why-buy",
    question: "Why buy on AI Exchange Club?",
    answer: [
      "Access exclusive deals: Discover unique and promising AI SaaS opportunities not found elsewhere.",
      "Benefit from competitive bidding: Participate in exciting auctions and secure the best deals.",
      "Leverage expert insights: Gain access to valuable data, market analysis, and industry trends.",
      "Connect with a thriving community: Network with other investors, entrepreneurs, and industry leaders.",
      "Streamlined acquisition process: Efficiently navigate the M&A process with our user-friendly platform."
    ]
  },
  {
    id: "why-sell",
    question: "Why sell on AI Exchange Club?",
    answer: [
      "Maximize your returns: Using our timed auction-based sales platform, AI innovators are able to get the highest amount possible for their AI products or working MVP models.",
      "Reach a targeted audience: Gain exposure to a highly engaged community of investors, acquirers, and industry professionals actively seeking innovative AI solutions.",
      "Access to valuable resources: Leverage our free AI valuation tool, expert insights, and community support to make informed decisions.",
      "Streamlined listing process: Easily list your AI product with our user-friendly platform and reach a global audience.",
      "Benefit from our marketing efforts: Gain visibility through our featured product section and targeted marketing campaigns."
    ]
  },
  {
    id: "membership-fee",
    question: "What is the membership fee for the platform?",
    answer: "The membership fee is $20 per month for both buyers and sellers."
  },
  {
    id: "listing-process",
    question: "How does the listing process work?",
    answer: "Sellers can list their AI SaaS products on the platform by providing key details, uploading pitch decks, and selecting a selling method (fixed price or auction). A $100 listing fee applies."
  },
  {
    id: "commission",
    question: "What is the commission structure?",
    answer: "We charge a 1-3% commission on the successful sale of an AI SaaS company."
  },
  {
    id: "payment-methods",
    question: "What payment methods are accepted?",
    answer: "We currently accept payments through Escrow.com, a secure third-party payment processor, to ensure safe and transparent transactions."
  },
  {
    id: "bidding-process",
    question: "How does the bidding process work?",
    answer: "Most listings will use a timed auction format. Buyers can place bids, and the highest bidder at the end of the auction period typically wins."
  },
  {
    id: "hot-deals",
    question: "What is the purpose of the \"Hot Deals\" section?",
    answer: "The \"Hot Deals\" section highlights companies with high view/click rates on their pitch decks or those generating significant bidding activity, making them attractive investment opportunities."
  },
  {
    id: "contact-users",
    question: "How can I contact other users on the platform?",
    answer: "You can contact other users through the platform's messaging system to inquire about listings, discuss deals, or exchange information."
  },
  {
    id: "refund-policy",
    question: "Is there a refund policy for membership fees?",
    answer: "No refunds for monthly memberships. Refunds for listing fees may be considered under certain circumstances."
  },
  {
    id: "support",
    question: "What happens if I encounter a problem or have a question?",
    answer: "You can visit our contact us page or use the live chat feature for immediate assistance. Our support team is happy to help!"
  }
];