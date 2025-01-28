import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MousePointer } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface NewsletterSubscriptionProps {
  newsletterEmail: string;
  setNewsletterEmail: (email: string) => void;
  subscriberCount: number;
  setSubscriberCount: React.Dispatch<React.SetStateAction<number>>;
}

const NewsletterSubscription = ({
  newsletterEmail,
  setNewsletterEmail,
  subscriberCount,
  setSubscriberCount,
}: NewsletterSubscriptionProps) => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter email submitted:", newsletterEmail);
    setSubscriberCount((prev) => Math.min(prev + 1, 1000));
    
    // Show success toast with thank you message
    toast.success("Thanks for subscribing!", {
      description: "Welcome to the AI Exchange Club! We'll keep you updated on exclusive deals and opportunities.",
    });
    
    setNewsletterEmail("");
  };

  return (
    <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md">
      <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <div className="relative flex-grow">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Join the Early Bird Waitlist"
              className="pl-10 bg-white/5 border-gray-500/30 text-white placeholder:text-gray-400"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-8 shadow-lg">
            Join
            <MousePointer className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-gray-300 px-2">
          Join the first 1,000 to join the AI Exchange Club waitlist. Receive a{' '}
          <span className="text-[#D946EF] font-semibold">free AI valuation</span>,{' '}
          <span className="text-[#0EA5E9] font-semibold">lifetime membership</span>, and{' '}
          <span className="text-purple-400 font-semibold">waived listing fees</span>. Buyers: Enjoy{' '}
          <span className="text-emerald-400 font-semibold">early access to exclusive deals</span> and connect with top AI innovators.
        </p>
        <div className="space-y-2">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] transition-all duration-500"
              style={{ width: `${(subscriberCount / 1000) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-300">
            <span className="text-white font-semibold">{subscriberCount}</span> out of <span className="text-white font-semibold">1,000</span> spots claimed
          </p>
        </div>
      </motion.div>
    </form>
  );
};

export default NewsletterSubscription;