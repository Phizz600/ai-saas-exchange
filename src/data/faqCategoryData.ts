
import { BookOpen, Server, ShieldCheck, CreditCard, HelpCircle, Settings, Users } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string | string[];
}

export interface FAQCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  items: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: "general",
    title: "General Questions",
    description: "Basic information about AI Exchange Club",
    icon: HelpCircle,
    items: [
      {
        id: "what-is",
        question: "What is AI Exchange Club?",
        answer: "AI Exchange Club is a marketplace designed specifically for buying and selling AI SaaS products and models. We provide a secure platform for entrepreneurs, investors, and businesses to connect and transact."
      },
      {
        id: "how-works",
        question: "How does AI Exchange Club work?",
        answer: "Our platform connects AI SaaS sellers with potential buyers. Sellers list their products with detailed information, and buyers can browse, evaluate, and purchase these products through our secure platform. We facilitate the entire process from discovery to transaction completion."
      },
      {
        id: "membership",
        question: "Is membership required?",
        answer: "Yes, membership is required to access the full features of our platform. We charge a monthly fee of $20 to ensure serious buyers and sellers, which helps maintain a high-quality marketplace."
      }
    ]
  },
  {
    id: "sellers",
    title: "For Sellers",
    description: "Information for those selling AI products",
    icon: Server,
    items: [
      {
        id: "how-list",
        question: "How do I list my AI SaaS product?",
        answer: "After creating an account and subscribing to our service, you can list your product by providing details like product description, metrics, technology stack, screenshots, and pricing information. You'll also need to pay a listing fee of $100."
      },
      {
        id: "commission",
        question: "What are the commission rates?",
        answer: [
          "We use a tiered commission structure based on the final selling price:",
          "10% for sales up to $10,000",
          "8% for sales between $10,001 and $50,000",
          "6% for sales between $50,001 and $100,000",
          "5% for sales over $100,001"
        ]
      },
      {
        id: "valuation",
        question: "Do you help with valuation?",
        answer: "Yes, we provide a free AI SaaS valuation tool that helps sellers determine a fair market value for their products based on metrics, user base, revenue, and other important factors."
      }
    ]
  },
  {
    id: "buyers",
    title: "For Buyers",
    description: "Information for those purchasing AI products",
    icon: CreditCard,
    items: [
      {
        id: "how-buy",
        question: "How do I purchase an AI SaaS product?",
        answer: "You can browse our marketplace, evaluate products based on their metrics and documentation, and then place bids in auctions or make direct offers. Once accepted, we facilitate the payment and transfer process through our secure escrow system."
      },
      {
        id: "verification",
        question: "How do you verify products?",
        answer: "We have a thorough verification process for all listings. Sellers must provide detailed information about their product, including metrics that are verified where possible. We also have buyer protections and an escrow system to ensure safe transactions."
      },
      {
        id: "refund",
        question: "Is there a refund policy?",
        answer: "While we don't offer refunds for membership fees, transactions are protected through our escrow service, which ensures buyers receive what they paid for before funds are released to sellers."
      }
    ]
  },
  {
    id: "security",
    title: "Security & Privacy",
    description: "Information about our security practices",
    icon: ShieldCheck,
    items: [
      {
        id: "data-privacy",
        question: "How do you handle my data?",
        answer: "We take data privacy seriously. All personal and business information is encrypted and stored securely. We don't share your information with third parties without your consent."
      },
      {
        id: "nda",
        question: "Are NDAs available for sensitive discussions?",
        answer: "Yes, we provide built-in NDA functionality to protect sellers' sensitive information. Potential buyers can sign NDAs directly through our platform before accessing confidential details."
      },
      {
        id: "escrow",
        question: "How does your escrow service work?",
        answer: "Our escrow service holds buyer funds securely until all conditions of the sale are met. This protects both parties by ensuring the buyer receives the promised product and the seller receives payment."
      }
    ]
  },
  {
    id: "support",
    title: "Support & Resources",
    description: "Help and educational resources",
    icon: BookOpen,
    items: [
      {
        id: "contact-support",
        question: "How can I contact support?",
        answer: "You can contact our support team through the contact form on our website, via email at support@aiexchange.club, or through the live chat feature available on our platform."
      },
      {
        id: "resources",
        question: "Do you provide educational resources?",
        answer: "Yes, we offer a variety of resources including blog posts, guides, and case studies to help both buyers and sellers navigate the AI SaaS marketplace effectively."
      },
      {
        id: "community",
        question: "Is there a community forum?",
        answer: "We're developing a community section where users can share experiences, ask questions, and network with other AI entrepreneurs and investors."
      }
    ]
  }
];
