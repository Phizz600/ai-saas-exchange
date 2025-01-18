import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const featuredCompanies = [
  {
    id: 1,
    name: "AI Vision Pro",
    description: "Computer Vision Solutions",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=vision",
    sponsored: true,
  },
  {
    id: 2,
    name: "DataMind AI",
    description: "ML Infrastructure Platform",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=data",
    sponsored: false,
  },
  {
    id: 3,
    name: "NLP Master",
    description: "Natural Language Processing API",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=nlp",
    sponsored: true,
  },
];

export const FeaturedCompaniesSlideshow = () => {
  return (
    <div className="bg-gradient-to-r from-accent2 to-accent3 rounded-lg p-8 mb-12">
      <h2 className="text-xl font-semibold text-white mb-6">Featured Companies</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {featuredCompanies.map((company) => (
            <CarouselItem key={company.id} className="md:basis-1/3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <h3 className="text-white font-medium flex items-center gap-2">
                    {company.name}
                    {company.sponsored && (
                      <span className="text-xs bg-primary/20 text-primary-foreground px-2 py-1 rounded">
                        Sponsored
                      </span>
                    )}
                  </h3>
                  <p className="text-white/70 text-sm">{company.description}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex">
          <ArrowLeft className="h-4 w-4" />
        </CarouselPrevious>
        <CarouselNext className="hidden md:flex">
          <ArrowRight className="h-4 w-4" />
        </CarouselNext>
      </Carousel>
    </div>
  );
};