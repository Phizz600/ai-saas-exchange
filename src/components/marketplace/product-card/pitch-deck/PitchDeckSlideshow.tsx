import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Presentation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PitchDeckSlide {
  title: string;
  content: string[];
}

interface PitchDeckSlideshowProps {
  product: {
    title: string;
    description: string;
    category: string;
    stage: string;
    monthlyRevenue?: number;
  };
}

export function PitchDeckSlideshow({ product }: PitchDeckSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [pitchDeck, setPitchDeck] = useState<PitchDeckSlide[]>([]);
  const { toast } = useToast();

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
  );
}