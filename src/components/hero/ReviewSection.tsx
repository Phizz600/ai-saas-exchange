
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import SenjaTestimonials from "@/components/SenjaTestimonials";

interface Reviewer {
  name: string;
  title: string;
  company: string;
  avatar: string;
  review: string;
  stars: number;
}

const reviewers: Reviewer[] = [
  {
    name: "Michael Anderson",
    title: "Founder",
    company: "AI Builder",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    review: "AI Exchange Club is an incredible marketplace for AI products. We've been able to acquire quality SaaS tools efficiently.",
    stars: 5
  },
  {
    name: "Sarah Johnson",
    title: "CEO",
    company: "TechVentures",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    review: "With AI tools being high margin businesses, they're perfect for acquisitions. This platform makes the process seamless.",
    stars: 5
  },
  {
    name: "David Chen",
    title: "Head of Product",
    company: "Neural Systems",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    review: "Excited to see AI Exchange Club become the premier marketplace to buy or sell AI SaaS businesses!",
    stars: 5
  },
  {
    name: "Jessica Park",
    title: "Founder",
    company: "AIAcquire",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    review: "Check out @aiexchange, love the concept! It's revolutionizing how we trade AI-powered businesses.",
    stars: 5
  },
  {
    name: "Robert Torres",
    title: "Serial Entrepreneur",
    company: "AI Ventures",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    review: "I wholeheartedly recommend AI Exchange Club if you want to sell your AI business or acquire promising startups.",
    stars: 5
  }
];

export default function ReviewSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#f8fafc] via-[#f5f7fa] to-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 text-4xl font-bold exo-2-heading bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent"
        >
          Hear what these people think about AI Exchange Club
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-16 text-gray-600 max-w-2xl mx-auto"
        >
          Join hundreds of satisfied users who are already experiencing the benefits of our platform
        </motion.p>
        
        {/* Senja Testimonials Widget */}
        <SenjaTestimonials />
        
        {/* Original testimonials are kept as a fallback */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {reviewers.slice(0, 3).map((reviewer, index) => (
              <ReviewCard key={index} reviewer={reviewer} index={index} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {reviewers.slice(3, 5).map((reviewer, index) => (
              <ReviewCard key={index + 3} reviewer={reviewer} index={index + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ reviewer, index }: { reviewer: Reviewer; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full p-6 bg-white border-[#d1d5db]/20 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div className="space-y-4">
          {/* Star rating */}
          <div className="flex text-[#8B5CF6]">
            {[...Array(reviewer.stars)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>

          {/* Review text */}
          <p className="text-gray-700 text-lg leading-relaxed">{reviewer.review}</p>

          {/* Reviewer info */}
          <div className="flex items-center pt-4">
            <img
              src={reviewer.avatar}
              alt={reviewer.name}
              className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-[#D946EE]/10"
            />
            <div>
              <h4 className="font-bold text-gray-900">{reviewer.name}</h4>
              <p className="text-gray-500">
                {reviewer.title}, {reviewer.company}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
