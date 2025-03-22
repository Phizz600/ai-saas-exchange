
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
        answer: "AI Exchange Club is a specialized marketplace designed specifically for buying and selling AI tools, SaaS platforms, and applications. We use innovative Dutch auctions and smart matching technology to connect buyers with the perfect AI solutions for their needs. Think of us as the bridge between AI creators and those looking to leverage AI power in their business or personal projects."
      },
      {
        id: "dutch-auction",
        question: "How does the Dutch auction model work?",
        answer: "Our Dutch auction model is pretty straightforward! Unlike traditional auctions where prices go up, our listings start at a higher price and gradually decrease over time until someone makes a purchase. It's a bit like a game of chicken - wait too long for a lower price and someone else might grab it before you! This ensures both sellers get fair market value and buyers don't overpay. You can set alerts to notify you when a listing reaches your desired price point."
      },
      {
        id: "fees",
        question: "What fees do you charge?",
        answer: "We keep our fee structure simple and transparent with tiered commissions based on the final selling price:\n\n• 10% for sales up to $10,000\n• 8% for sales between $10,001-$50,000\n• 6% for sales between $50,001-$100,000\n• 5% for sales over $100,001\n\nThere are no hidden fees or charges - what you see is what you pay. These fees help us maintain the platform, verify listings, and provide our secure escrow service."
      },
      {
        id: "data-security",
        question: "Is my data secure?",
        answer: "Absolutely! Security is our top priority. All transactions are processed through Escrow.com, a trusted third-party service. We use bank-level encryption for all sensitive data, implement strict access controls, and follow industry best practices for data protection. We never share your information with third parties without your consent. Our team regularly conducts security audits to ensure we maintain the highest standards of data security."
      },
      {
        id: "contact-support",
        question: "How do I contact support?",
        answer: "We're always here to help! You can reach our support team through multiple channels:\n\n• Email us at support@aiexchangeclub.com\n• Use the in-app chat feature for immediate assistance\n• Schedule a call with our support team through your dashboard\n\nOur support team is available 24/7, and we typically respond to inquiries within 2 hours during business days."
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
        answer: "Finding the perfect AI tool is easy with our platform! You have several options:\n\n• Use our AI Matchmaker tool - tell us what you need, and we'll find the best matches\n• Set up custom alerts based on features, price range, or categories\n• Browse our curated collections organized by industry, function, or use case\n• Use our advanced search filters to narrow down options\n\nWe also provide detailed comparison tools so you can evaluate multiple options side-by-side."
      },
      {
        id: "negotiate",
        question: "Can I negotiate prices outside auctions?",
        answer: "To keep our marketplace fair and secure for everyone, all transactions must go through our platform. This policy exists to protect both buyers and sellers from fraud and ensure all parties are protected by our escrow system. However, our Dutch auction model naturally finds the fair market price, and you can always set price alerts to be notified when a listing hits your target price point. This approach has proven to be more effective than traditional negotiation!"
      },
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer: "We offer a variety of secure payment options to make purchasing as convenient as possible:\n\n• All major credit and debit cards (Visa, Mastercard, Amex, Discover)\n• Bank transfers (ACH, wire transfers, SEPA)\n• Escrow.com's secure payment system\n\nAll payments are processed through secure, encrypted channels. We don't store your payment information on our servers - your financial data never touches our system directly."
      },
      {
        id: "tool-expectations",
        question: "What if the tool doesn't meet expectations?",
        answer: "Your satisfaction is guaranteed! All funds are held in escrow until you confirm you're happy with your purchase. After purchase, you'll have an inspection period (typically 3-7 days, depending on the tool complexity) to verify everything works as described. If there are issues, our dispute resolution team will step in to help. In cases where the tool genuinely doesn't match the listing description, you'll receive a full refund. This process provides peace of mind for every purchase."
      },
      {
        id: "verify-performance",
        question: "How do I verify a tool's performance?",
        answer: "We provide multiple ways to evaluate tools before purchase:\n\n• Access our AI evaluation reports with performance metrics and benchmarks\n• Chat directly with sellers to ask specific questions\n• Request demos or trial access when available\n• Review detailed documentation, screenshots, and video walkthroughs\n• Read verified reviews from other buyers\n\nMany listings also include live demo environments where you can test core functionality before making a decision."
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
        answer: "Getting your AI tool listed is a straightforward process:\n\n1. Submit your tool details through your seller dashboard\n2. Our team reviews the listing for completeness and accuracy (usually within 24 hours)\n3. Once approved, your listing goes live on the marketplace\n4. You can track views, inquiries, and offers through your dashboard\n\nWe also offer premium listing services where our team can help optimize your listing for maximum visibility and appeal."
      },
      {
        id: "required-info",
        question: "What information do I need to provide?",
        answer: "To create a compelling listing that attracts serious buyers, you'll need to provide:\n\n• Revenue data and growth metrics\n• Technical stack and architecture details\n• Customer metrics (user count, churn rate, etc.)\n• A demo video showcasing key features\n• Documentation and API references (if applicable)\n• Pricing model and historical data\n• Information about ongoing costs and maintenance\n\nThe more comprehensive your listing, the faster it typically sells and at better prices."
      },
      {
        id: "reserve-price",
        question: "Can I set a reserve price?",
        answer: "Yes! We understand you have a minimum price in mind. For Dutch auctions, you can set a reserve price - this is the lowest amount the auction will reach before ending. This gives you complete control over your minimum acceptable price while still leveraging the benefits of the Dutch auction model. Your reserve price isn't visible to buyers, creating a natural market dynamic while protecting your interests."
      },
      {
        id: "sell-time",
        question: "How long does it take to sell?",
        answer: "Selling timelines vary based on several factors, but most tools sell within 2-4 weeks of listing. Premium, well-documented tools with strong metrics often sell faster, sometimes within days. Pricing strategy plays a major role - tools priced appropriately for their features and metrics tend to sell more quickly. Our data shows that listings with complete information, demo videos, and responsive sellers complete transactions 60% faster than those without."
      },
      {
        id: "boost-visibility",
        question: "How do I boost my listing's visibility?",
        answer: "There are several effective ways to make your listing stand out:\n\n• Upgrade to a Featured Listing for premium placement on search results and the homepage\n• Add high-quality screenshots and demo videos\n• Participate in our weekly showcase emails\n• Boost your seller reputation by responding quickly to inquiries\n• Share detailed metrics and transparent information\n\nWe also offer promotional packages that include social media features and newsletter inclusions to reach our entire buyer community."
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
        answer: "Escrow.com acts as a trusted neutral third party for all transactions. Here's how the process works:\n\n1. The buyer deposits funds with Escrow.com (not directly to the seller)\n2. The seller transfers the tool or provides access\n3. The buyer verifies everything works as described\n4. Once the buyer approves, Escrow.com releases the funds to the seller\n\nThis process eliminates the risks of fraudulent payments or sellers disappearing after receiving payment, creating a safe environment for high-value digital asset transactions."
      },
      {
        id: "disputes",
        question: "What happens if there's a dispute?",
        answer: "We have a structured dispute resolution process designed to be fair to both parties:\n\n1. Our team reviews all communication history and listing details\n2. Escrow.com mediates the dispute with input from both parties\n3. We provide chat logs, transaction records, and listing details as evidence\n4. If necessary, technical experts evaluate the tool against the listing claims\n\nMost disputes are resolved within 5-7 business days. Our historical data shows that over 95% of disputes end with a mutually agreeable resolution rather than a complete cancellation."
      },
      {
        id: "verification",
        question: "Do you verify buyers/sellers?",
        answer: "Yes, trust is fundamental to our marketplace. Every user undergoes a Know Your Customer (KYC) verification process that includes:\n\n• Identity verification through government-issued ID\n• Business verification for companies\n• Email and phone verification\n• For sellers of high-value tools, we conduct additional background checks\n\nThis multi-layered approach ensures that you're always dealing with legitimate, verified parties, significantly reducing the risk of fraud or misrepresentation."
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
        answer: "Yes, you can delete your account at any time through the Account Settings page. However, there are a few important points to note:\n\n• Any active transactions must be completed or cancelled first\n• Your listing history will be archived but not immediately removed\n• Completed transaction records are retained for legal and tax purposes\n• You can request complete data deletion under applicable privacy laws\n\nIf you're considering account deletion due to a specific issue, please contact our support team first - we might be able to resolve your concerns without losing your account history."
      },
      {
        id: "update-payment",
        question: "How do I update my payment details?",
        answer: "Updating your payment information is simple and secure:\n\n1. Log into your account and navigate to the Billing section in your dashboard\n2. Click on 'Payment Methods'\n3. Select 'Add new payment method' or edit an existing one\n4. Follow the prompts to securely enter your information\n\nAll payment information is encrypted and processed through our secure payment partners. We never store complete payment details on our servers. Changes to payment methods take effect immediately for future transactions."
      }
    ]
  }
];
