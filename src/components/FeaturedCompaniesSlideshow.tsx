import { ArrowLeft, ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Sample data for featured companies
const featuredCompanies = [{
  id: 1,
  name: "AI Vision Pro",
  description: "Computer Vision Solutions",
  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=vision",
  sponsored: true
}, {
  id: 2,
  name: "DataMind AI",
  description: "ML Infrastructure Platform",
  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=data",
  sponsored: false
}, {
  id: 3,
  name: "NLP Master",
  description: "Natural Language Processing API",
  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=nlp",
  sponsored: true
}];
export const FeaturedCompaniesSlideshow = () => {
  return <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 exo-2-heading">Featured Companies</h2>
        <Link to="/marketplace" className="text-primary text-sm font-medium hover:underline">
          View all
        </Link>
      </div>
      
      
    </div>;
};