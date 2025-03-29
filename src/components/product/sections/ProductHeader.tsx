import { Share2, Heart, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
interface ProductHeaderProps {
  product: {
    id: string;
    title: string;
    description: string;
  };
  isLiked: boolean;
  setIsLiked: (value: boolean) => void;
}
export function ProductHeader({
  product,
  isLiked,
  setIsLiked
}: ProductHeaderProps) {
  const {
    toast
  } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) return;
        const {
          data: profile
        } = await supabase.from('profiles').select('saved_products').eq('id', user.id).single();
        if (profile?.saved_products?.includes(product.id)) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    checkIfSaved();
  }, [product.id]);
  const handleLike = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like products",
          variant: "destructive"
        });
        return;
      }
      const {
        data: profile
      } = await supabase.from('profiles').select('liked_products').eq('id', user.id).single();
      const currentLikes = profile?.liked_products || [];
      const newLikes = isLiked ? currentLikes.filter((productId: string) => productId !== product.id) : [...currentLikes, product.id];
      await supabase.from('profiles').update({
        liked_products: newLikes,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Product unliked" : "Product liked",
        description: isLiked ? "Removed from your liked products" : "Added to your liked products"
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Could not update liked status",
        variant: "destructive"
      });
    }
  };
  const handleSave = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save products",
          variant: "destructive"
        });
        return;
      }
      const {
        data: profile
      } = await supabase.from('profiles').select('saved_products').eq('id', user.id).single();
      const currentSaves = profile?.saved_products || [];
      const newSaves = isSaved ? currentSaves.filter((id: string) => id !== product.id) : [...currentSaves, product.id];
      await supabase.from('profiles').update({
        saved_products: newSaves,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Product unsaved" : "Product saved",
        description: isSaved ? "Removed from your saved products" : "Added to your saved products"
      });
    } catch (error) {
      console.error('Error toggling product save:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to your clipboard"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Product link has been copied to your clipboard"
      });
    }
  };
  return <div className="space-y-5">
      <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }} className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-1 exo-2-heading bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EE]">
            {product.title}
          </h1>
          
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleShare} className="relative overflow-hidden group border-gray-200 hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-colors">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EE]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Share2 className="h-4 w-4 relative z-10" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSave} className={`relative overflow-hidden group border-gray-200 hover:border-[#D946EE] ${isSaved ? 'text-[#D946EE] border-[#D946EE]' : 'hover:text-[#D946EE]'} transition-colors`}>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D946EE]/10 to-[#8B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Bookmark className={`h-4 w-4 relative z-10 ${isSaved ? "fill-current" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleLike} className={`relative overflow-hidden group border-gray-200 hover:border-red-400 ${isLiked ? 'text-red-500 border-red-400' : 'hover:text-red-500'} transition-colors`}>
            <span className="absolute inset-0 w-full h-full bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Heart className={`h-4 w-4 relative z-10 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </motion.div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
      </div>
    </div>;
}