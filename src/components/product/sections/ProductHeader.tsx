import { Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductHeaderProps {
  product: {
    id: string;
    title: string;
    description: string;
  };
  isLiked: boolean;
  setIsLiked: (value: boolean) => void;
}

export function ProductHeader({ product, isLiked, setIsLiked }: ProductHeaderProps) {
  const { toast } = useToast();

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like products",
          variant: "destructive",
        });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('liked_products')
        .eq('id', user.id)
        .single();

      const currentLikes = profile?.liked_products || [];
      const newLikes = isLiked
        ? currentLikes.filter((productId: string) => productId !== product.id)
        : [...currentLikes, product.id];

      await supabase
        .from('profiles')
        .update({ 
          liked_products: newLikes,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Product unliked" : "Product liked",
        description: isLiked ? "Removed from your liked products" : "Added to your liked products",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Could not update liked status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-600">{product.description}</p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Link copied!",
              description: "Product link has been copied to your clipboard",
            });
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current text-red-500" : ""}`} />
        </Button>
      </div>
    </div>
  );
}