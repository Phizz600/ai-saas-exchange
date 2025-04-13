
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Sample data for featured companies
const featuredCompanies = [
  {
    id: 1,
    name: "AI Vision Pro",
    description: "Computer Vision Solutions",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=vision",
    sponsored: true
  }, 
  {
    id: 2,
    name: "DataMind AI",
    description: "ML Infrastructure Platform",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=data",
    sponsored: false
  }, 
  {
    id: 3,
    name: "NLP Master",
    description: "Natural Language Processing API",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=nlp",
    sponsored: true
  }
];

export const FeaturedCompaniesSlideshow = () => {
  return (
    <div className="my-6 bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 exo-2-featured text-gray-800">Featured Companies</h3>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {featuredCompanies.map((company) => (
            <CarouselItem key={company.id} className="md:basis-1/3 lg:basis-1/4">
              <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 flex flex-col items-center text-center h-full">
                <div className="bg-gray-100 p-2 rounded-full mb-3">
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="w-16 h-16"
                  />
                </div>
                <h4 className="font-medium text-gray-900">{company.name}</h4>
                <p className="text-sm text-gray-500">{company.description}</p>
                {company.sponsored && (
                  <span className="mt-2 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    Sponsored
                  </span>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious className="relative static rounded-full" />
          <CarouselNext className="relative static rounded-full" />
        </div>
      </Carousel>
    </div>
  );
};
