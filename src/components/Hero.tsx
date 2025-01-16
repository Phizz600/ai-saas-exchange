import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Hero = () => {
  const [email, setEmail] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Waitlist email submitted:", email);
    toast.success("Thanks for joining the waitlist!");
    setEmail("");
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter email submitted:", newsletterEmail);
    toast.success("Successfully subscribed to newsletter!");
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-accent">
      {/* Gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative container mx-auto px-4 py-24 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Badge */}
          <span className="inline-block px-4 py-2 text-sm font-medium bg-white shadow-lg rounded-full border border-gray-100">
            The Future of AI SaaS M&A
          </span>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Where AI SaaS Companies
            <br />
            <span className="text-primary">Find Their Perfect Match</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Connect with investors, participate in bid-based auctions, and grow your AI business. Get AI-powered valuations and exclusive access to premium deals.
          </p>

          {/* CTA Section */}
          <div className="flex flex-col gap-6 items-center">
            {/* Waitlist Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-md transform hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-lg shadow-2xl">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow border-gray-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 shadow-lg">
                  Join Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md transform hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/90 rounded-lg shadow-xl">
                <Input
                  type="email"
                  placeholder="Subscribe to newsletter"
                  className="flex-grow border-gray-200"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white px-8 shadow-lg">
                  Subscribe
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 text-sm text-gray-200">
            ✓ Free AI Valuations &nbsp; • &nbsp; ✓ Secure Platform &nbsp; • &nbsp; ✓ Premium Network
          </div>
        </div>
      </div>
    </div>
  );
};