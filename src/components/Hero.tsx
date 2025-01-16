import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Subtle gradient overlay */}
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
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Where AI SaaS Companies
            <br />
            <span className="text-primary">Find Their Perfect Match</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Connect with investors, participate in bid-based auctions, and grow your AI business. Get AI-powered valuations and exclusive access to premium deals.
          </p>

          {/* CTA Section */}
          <div className="max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-lg shadow-2xl">
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
            </form>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 text-sm text-gray-500">
            ✓ Free AI Valuations &nbsp; • &nbsp; ✓ Secure Platform &nbsp; • &nbsp; ✓ Premium Network
          </div>
        </div>
      </div>
    </div>
  );
};