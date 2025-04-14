
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
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 exo-2-heading">Featured Companies</h2>
        <Link to="/marketplace" className="text-primary text-sm font-medium hover:underline">
          View all
        </Link>
      </div>
      
      <Carousel>
        <CarouselContent>
          {featuredCompanies.map((company) => (
            <CarouselItem key={company.id} className="md:basis-1/2 lg:basis-1/3">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border border-white/20 shadow-md">
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                        <img src={company.logo} alt={company.name} className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{company.name}</h3>
                        <p className="text-sm text-gray-600">{company.description}</p>
                      </div>
                    </div>
                    {company.sponsored && (
                      <div className="mt-2">
                        <span className="text-xs bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] text-white px-2 py-0.5 rounded-full">
                          Sponsored
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 bg-white/20 backdrop-blur-md border border-white/10 text-white" />
        <CarouselNext className="right-1 bg-white/20 backdrop-blur-md border border-white/10 text-white" />
      </Carousel>
    </div>
  );
};
