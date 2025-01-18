import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const demoProducts = [
  {
    title: "AI Content Generator",
    description: "Example: Generate high-quality content using advanced AI models",
    category: "Content Generation",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    price: "25,000"
  },
  {
    title: "Computer Vision API",
    description: "Example: Process and analyze images with state-of-the-art AI",
    category: "Computer Vision",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    price: "35,000"
  },
  {
    title: "NLP Platform",
    description: "Example: Advanced natural language processing capabilities",
    category: "Language Processing",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    price: "45,000"
  }
];

export const DemoProductCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {demoProducts.map((product, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group"
        >
          <Card className="overflow-hidden bg-white/90 backdrop-blur-xl border-gray-100/50">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-md">
                  Demo
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <Badge className="mb-2" variant="secondary">
                {product.category}
              </Badge>
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-primary font-semibold">${product.price}</div>
                <Button variant="ghost" className="group">
                  Preview
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};