import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

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
  {
    id: 4,
    name: "AutoML Labs",
    description: "Automated Machine Learning Platform",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=automl",
    sponsored: true,
  },
  {
    id: 5,
    name: "AI Forge",
    description: "Enterprise AI Solutions",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=forge",
    sponsored: false,
  },
];

export const FeaturedCompaniesSlideshow = () => {
  return (
    <div className="w-full bg-gradient-to-r from-accent2 to-accent3 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-white mb-8">Featured Companies of the Week</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredCompanies.map((company) => (
              <CarouselItem key={company.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-full">
                  <div className="flex items-center gap-4">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-12 h-12 rounded"
                    />
                    <div>
                      <h3 className="text-white font-medium flex items-center gap-2">
                        {company.name}
                        {company.sponsored && (
                          <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                            Sponsored
                          </Badge>
                        )}
                      </h3>
                      <p className="text-white/70 text-sm">{company.description}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </div>
  );
};