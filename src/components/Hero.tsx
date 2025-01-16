import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <span className="inline-block px-3 py-1 text-sm font-medium bg-secondary/10 text-secondary rounded-full mb-4">
          The Future of AI SaaS M&A
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
          Where AI SaaS Companies 
          <br />
          Find Their Perfect Match
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          The premier marketplace for buying and selling AI SaaS companies. 
          Get AI-powered valuations and connect with qualified buyers and sellers.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/marketplace">
            <Button className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6">
              Explore Marketplace
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" className="text-lg px-8 py-6">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};