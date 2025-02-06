import { Timer, TrendingDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProductPricingProps {
  product: {
    id: string;
    current_price?: number;
    price?: number;
    auction_end_time?: string;
    price_decrement?: number;
    timeLeft?: string;
    demo_url?: string;
  };
}

export function ProductPricing({ product }: ProductPricingProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Current Price</p>
            <p className="text-3xl font-bold">
              ${(product.current_price || product.price || 0).toLocaleString()}
            </p>
          </div>
          {product.auction_end_time && (
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Timer className="h-4 w-4" />
                <span>{product.timeLeft || 'Auction ended'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingDown className="h-4 w-4" />
                <span>Drops ${product.price_decrement ? product.price_decrement.toLocaleString() : '0'}/hour</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
          >
            {product.auction_end_time ? "Place Bid" : "Buy Now"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                View Pitch Deck
              </Button>
            </DialogTrigger>
            <DialogContent>
              {/* Pitch deck content */}
            </DialogContent>
          </Dialog>
        </div>

        {product.demo_url && (
          <a 
            href={product.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline mt-4"
          >
            <ExternalLink className="h-4 w-4" />
            View Live Demo
          </a>
        )}
      </div>
    </Card>
  );
}