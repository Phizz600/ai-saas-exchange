
import { lazy, Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./hero/AnimatedBackground";
import { HeroTitle } from "./hero/HeroTitle";
import { HowItWorks } from "./hero/HowItWorks";
import { FeatureHighlights } from "./hero/FeatureHighlights";
import { SecurityFeatures } from "./hero/SecurityFeatures";
import { RoleInfo } from "./hero/RoleInfo";
import { NewsletterSubscription } from "./hero/NewsletterSubscription";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "AI Startup Founder",
    image: "/lovable-uploads/b28ada26-b74c-49aa-bb25-5908300ec35c.png",
    text: "AI Exchange helped me find the perfect buyer for my AI content generation tool. The auction process was smooth and transparent.",
    rating: 5
  },
  {
    name: "Michael Thompson",
    role: "Tech Investor",
    image: "/lovable-uploads/c2d95fc3-b2b8-41f4-bee8-877a1d72cf6e.png",
    text: "As an investor, I've found several promising AI startups through this platform. The verification process gives me confidence in my investments.",
    rating: 5
  },
  {
    name: "David Rodriguez",
    role: "Serial Entrepreneur",
    image: "/lovable-uploads/f07753e1-1a02-44c4-82cc-0be1047cdf6e.png",
    text: "Sold my AI analytics platform in just 3 weeks. The platform's reach and professional buyer base exceeded my expectations.",
    rating: 5
  }
];

const ProductCard = lazy(() => import("@/components/ProductCard"));

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-12">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <HeroTitle />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto text-center"
          >
            Join an exclusive network of investors gaining early access to cutting-edge AI products, tools, and companies through our innovative auction marketplace.
          </motion.p>

          <div className="flex flex-col gap-6 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white hover:opacity-90 min-w-[200px]">
                  Start Buying
                </Button>
              </Link>
              <Link to="/listproduct">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 min-w-[200px]">
                  Start Selling
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          <Suspense fallback={<Skeleton className="h-[400px] rounded-xl" />}>
            <ProductCard
              id="1"
              title="AI Content Generator"
              description="Advanced AI tool for generating high-quality content across multiple formats"
              price={4999}
              image="/lovable-uploads/47eac7ab-ce1a-4bb8-800b-19f2bfcdd765.png"
              category="Content Generation"
              stage="Growth"
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[400px] rounded-xl" />}>
            <ProductCard
              id="2"
              title="ML Analytics Platform"
              description="Enterprise-grade analytics platform powered by machine learning"
              price={12999}
              image="/lovable-uploads/5947d1a1-1385-49a1-bf8f-3024df268fb6.png"
              category="Analytics"
              stage="Scale"
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[400px] rounded-xl hidden lg:block" />}>
            <div className="hidden lg:block">
              <ProductCard
                id="3"
                title="Computer Vision API"
                description="Comprehensive computer vision API for real-time image analysis"
                price={7999}
                image="/lovable-uploads/b2726e08-98dd-472d-b44a-b780d6e1343e.png"
                category="Computer Vision"
                stage="Growth"
              />
            </div>
          </Suspense>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-8">What Our Users Say</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="bg-white/10 backdrop-blur-sm border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-white">{testimonial.name}</h3>
                          <p className="text-gray-300 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-200 italic">{testimonial.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </motion.div>

        <HowItWorks />
        <FeatureHighlights />
        <SecurityFeatures />
        <RoleInfo />
        <NewsletterSubscription />
      </div>
    </div>
  );
};

export default Hero;
