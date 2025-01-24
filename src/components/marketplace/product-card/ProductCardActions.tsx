import { MessageSquare, Eye, Presentation, Timer, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PitchDeckSlide {
  title: string;
  content: string[];
}

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
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [pitchDeck, setPitchDeck] = useState<PitchDeckSlide[]>([]);
  const { toast } = useToast();
  const isAuction = !!product.auction_end_time;
  const auctionEnded = isAuction && new Date(product.auction_end_time) < new Date();

  const generatePitchDeck = async () => {
    setIsGeneratingDeck(true);
    try {
      const response = await supabase.functions.invoke('generate-pitch-deck', {
        body: {
          title: product.title,
          description: product.description,
          category: product.category,
          stage: product.stage,
          monthlyRevenue: product.monthlyRevenue
        }
      });

      if (response.error) throw response.error;

      const generatedDeck = response.data.choices[0].message.content;
      setPitchDeck(JSON.parse(generatedDeck));
    } catch (error) {
      console.error('Error generating pitch deck:', error);
      toast({
        title: "Error generating pitch deck",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  return (
    <CardFooter className="flex flex-col gap-3">
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

      {isAuction && (
        <div className="w-full p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-900">
                Dutch Auction
              </span>
            </div>
            {!auctionEnded && (
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Active
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Price</span>
              <span className="text-lg font-bold text-purple-600">
                ${product.current_price?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Min Price</span>
              <span className="font-medium text-gray-900">
                ${product.min_price?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Price Drop</span>
              <div className="flex items-center gap-1 text-amber-600">
                <DollarSign className="h-3 w-3" />
                <span>{product.price_decrement?.toLocaleString()}/min</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
            onClick={pitchDeck.length === 0 ? generatePitchDeck : undefined}
          >
            <Presentation className="h-4 w-4 mr-2" />
            {isGeneratingDeck ? "Generating Pitch Deck..." : "Open Pitch Deck"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <div className="relative overflow-hidden rounded-lg bg-white p-6">
            <AnimatePresence mode="wait">
              {pitchDeck.length > 0 ? (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-gray-900">
                    {pitchDeck[currentSlide].title}
                  </h2>
                  <ul className="space-y-2">
                    {pitchDeck[currentSlide].content.map((point, index) => (
                      <li key={index} className="text-gray-600">
                        • {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <div className="text-center py-8">
                  <Presentation className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    {isGeneratingDeck ? "Generating your pitch deck..." : "Click to generate a pitch deck"}
                  </p>
                </div>
              )}
            </AnimatePresence>

            {pitchDeck.length > 0 && (
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                  disabled={currentSlide === 0}
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {pitchDeck.map((_, index) => (
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
                  onClick={() => setCurrentSlide(prev => Math.min(pitchDeck.length - 1, prev + 1))}
                  disabled={currentSlide === pitchDeck.length - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </CardFooter>
  );
}