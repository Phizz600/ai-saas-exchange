
import { useEffect } from "react";
import { incrementProductViews, incrementProductClicks } from "@/integrations/supabase/functions";

interface ProductAnalyticsProps {
  productId: string;
}

export function useProductAnalytics({ productId }: ProductAnalyticsProps) {
  useEffect(() => {
    incrementProductViews(productId).catch(console.error);
  }, [productId]);

  const handleCardClick = async () => {
    try {
      await incrementProductClicks(productId);
    } catch (error) {
      console.error('Error tracking product click:', error);
    }
  };

  return { handleCardClick };
}
