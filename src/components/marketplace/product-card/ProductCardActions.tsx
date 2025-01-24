import { MessageSquare, Eye, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PitchDeckSlide {
  title: string;
  content: string;
  image?: string;
}

const generatePitchDeck = (product: any): PitchDeckSlide[] => {
  // This is a placeholder - will be replaced with GPT-4o generation
  return [
    {
      title: "Problem",
      content: "Current market challenges this product solves",
      image: product.image
    },
    {
      title: "Solution",
      content: product.description,
    },
    {
      title: "Market Opportunity",
      content: `Category: ${product.category}\nStage: ${product.stage}`,
    },
    {
      title: "Traction",
      content: `Monthly Revenue: $${product.monthlyRevenue?.toLocaleString() || 0}`,
    }
  ];
};

interface ProductCardActionsProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    stage: string;
    monthlyRevenue?: number;
    image?: string;
    auction_end_time?: string;
    current_price?: number;
    min_price?: number;
    price_decrement?: number;
  };
}

export function ProductCardActions({ product }: ProductCardActionsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = generatePitchDeck(product);
  const isAuction = !!product.auction_end_time;
  const auctionEnded = isAuction && new Date(product.auction_end_time) < new Date();

  return (
    <CardFooter className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button 
          variant="outline"
          className="w-full hover:bg-gray-50"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact
        </Button>
        <Button 
          variant="outline"
          className="w-full hover:bg-gray-50"
        >
          <Eye className="h-4 w-4 mr-2" />
          Details
        </Button>
      </div>

      {isAuction && !auctionEnded && (
        <div className="w-full p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-amber-700 font-medium">Current Price</span>
            <span className="text-amber-900 font-bold">
              ${product.current_price?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-amber-600">Min Price</span>
            <span className="text-amber-800">${product.min_price?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-amber-600">Price Drop</span>
            <span className="text-amber-800">-${product.price_decrement?.toLocaleString()}/min</span>
          </div>
        </div>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
          >
            <Presentation className="h-4 w-4 mr-2" />
            Open Pitch Deck
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <div className="relative overflow-hidden rounded-lg bg-white p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  {slides[currentSlide].title}
                </h2>
                {slides[currentSlide].image && (
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <p className="text-gray-600 whitespace-pre-line">
                  {slides[currentSlide].content}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === index ? 'bg-primary' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                disabled={currentSlide === slides.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CardFooter>
  );
}