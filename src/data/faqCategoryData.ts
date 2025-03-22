
import { 
  HelpCircle, 
  DollarSign, 
  Search, 
  ShieldCheck, 
  Upload, 
  UserCheck, 
  User, 
  MessageSquare 
} from "lucide-react";

export type FAQItem = {
  id: string;
  question: string;
  answer: string | string[];
};

export type FAQCategory = {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  items: FAQItem[];
};

export const faqCategories: FAQCategory[] = [
  {
    id: "general",
    title: "General Questions",
    icon: HelpCircle,
    description: "Basic information about AI Exchange Club and how it works",
    items: [
      {
        id: "what-is",
        question: "What is AI Exchange Club?",
        answer: "A marketplace for buying and selling AI tools, SaaS platforms, and apps using Dutch auctions and smart matching."
      },
      {
        id: "dutch-auction",
        question: "How does the Dutch auction model work?",
        answer: "Prices start high and decrease over time. Buyers bid as the price drops, ensuring fair market value."
      },
      {
        id: "fees",
        question: "What fees do you charge?",
        answer: "We have a tiered commission structure based on the final selling price: 10% for sales up to $10,000, 8% for $10,001-$50,000, 6% for $50,001-$100,000, and 5% for sales over $100,001."
      },
      {
        id: "data-security",
        question: "Is my data secure?",
        answer: "Yes—all transactions use Escrow.com, and we encrypt sensitive data."
      },
      {
        id: "contact-support",
        question: "How do I contact support?",
        answer: "Email support@aiexchangeclub.com or use the in-app chat."
      }
    ]
  },
  {
    id: "buyers",
    title: "For Buyers",
    icon: Search,
    description: "Information for those looking to purchase AI tools",
    items: [
      {
        id: "find-tools",
        question: "How do I find AI tools that match my criteria?",
        answer: "Use our AI Matchmaker tool or set up custom alerts."
      },
      {
        id: "negotiate",
        question: "Can I negotiate prices outside auctions?",
        answer: "No—all transactions must use our platform for security."
      },
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer: "Credit cards, bank transfers, and Escrow.com's secure payments."
      },
      {
        id: "tool-expectations",
        question: "What if the tool doesn't meet expectations?",
        answer: "Escrow.com holds funds until both parties confirm satisfaction."
      },
      {
        id: "verify-performance",
        question: "How do I verify a tool's performance?",
        answer: "Access our AI evaluation reports and chat directly with sellers."
      }
    ]
  },
  {
    id: "sellers",
    title: "For Sellers",
    icon: Upload,
    description: "Information for those looking to sell AI tools",
    items: [
      {
        id: "list-tool",
        question: "How do I list my AI tool?",
        answer: "Submit details via your dashboard. Our team reviews listings within 24 hours."
      },
      {
        id: "required-info",
        question: "What information do I need to provide?",
        answer: "Revenue, tech stack, customer metrics, and a demo video."
      },
      {
        id: "reserve-price",
        question: "Can I set a reserve price?",
        answer: "Yes—set a minimum price for Dutch auctions."
      },
      {
        id: "sell-time",
        question: "How long does it take to sell?",
        answer: "Most tools sell in 2-4 weeks, depending on pricing and demand."
      },
      {
        id: "boost-visibility",
        question: "How do I boost my listing's visibility?",
        answer: "Upgrade to a Featured Listing for premium placement."
      }
    ]
  },
  {
    id: "security",
    title: "Trust & Security",
    icon: ShieldCheck,
    description: "Information about our security measures",
    items: [
      {
        id: "escrow-protection",
        question: "How does Escrow.com protect my transaction?",
        answer: "Funds are held securely until both parties confirm terms are met."
      },
      {
        id: "disputes",
        question: "What happens if there's a dispute?",
        answer: "Escrow.com mediates disputes, and we provide chat logs as evidence."
      },
      {
        id: "verification",
        question: "Do you verify buyers/sellers?",
        answer: "Yes—all users undergo KYC checks."
      }
    ]
  },
  {
    id: "account",
    title: "Account Management",
    icon: User,
    description: "Managing your AI Exchange Club account",
    items: [
      {
        id: "delete-account",
        question: "Can I delete my account?",
        answer: "Yes—visit Account Settings. Note: Active transactions must resolve first."
      },
      {
        id: "update-payment",
        question: "How do I update my payment details?",
        answer: "Go to Billing in your dashboard."
      }
    ]
  }
];
