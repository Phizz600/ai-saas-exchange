
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
        <h2 className="text-xl font-semibold text-gray-900">Featured Companies</h2>
        <Link to="/marketplace" className="text-primary text-sm font-medium hover:underline">
          View all
        </Link>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {featuredCompanies.map((company) => (
            <CarouselItem key={company.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden h-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                      <img 
                        src={company.logo} 
                        alt={company.name} 
                        className="h-8 w-8"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">{company.name}</h3>
                        {company.sponsored && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-800 rounded">
                            Sponsored
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{company.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4" />
        <CarouselNext className="hidden sm:flex -right-4" />
      </Carousel>
    </div>
  );
};
