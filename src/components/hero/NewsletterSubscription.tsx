
import { motion } from "framer-motion";
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
  setSubscriberCount
}: NewsletterSubscriptionProps) => {
  return (
    <form className="w-full max-w-md mx-auto">
      <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col gap-4 items-center">
        <p className="text-sm text-gray-300 px-2 text-center">
          Be the first 1,000 to join the AI Exchange Club waitlist. Receive a{' '}
          <span className="text-[#D946EF] font-semibold">free valuation</span>,{' '}
          <span className="text-[#0EA5E9] font-semibold">lifetime membership</span>, and{' '}
          <span className="text-purple-400 font-semibold">90% off listing fees for life</span>. Buyers: Enjoy{' '}
          <span className="text-emerald-400 font-semibold">early access to exclusive deals</span> and connect with top AI innovators.
        </p>
        <div className="space-y-2 w-full">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] transition-all duration-500"
              style={{ width: `${(subscriberCount / 1000) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-300 text-center">
            <span className="text-white font-semibold">{subscriberCount}</span> out of{' '}
            <span className="text-white font-semibold">1,000</span> spots claimed
          </p>
        </div>
      </motion.div>
    </form>
  );
};
export default NewsletterSubscription;
