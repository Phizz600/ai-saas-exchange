import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileContentProps {
  profile: Profile;
}

export const ProfileContent = ({ profile }: ProfileContentProps) => {
  const navigate = useNavigate();
  const [userListings, setUserListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        console.log('Fetching listings for user:', profile.id);
        const { data: listings, error } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching user listings:', error);
          throw error;
        }

        console.log('Fetched listings:', listings);
        setUserListings(listings || []);
      } catch (error) {
        console.error('Error in fetchUserListings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserListings();
  }, [profile.id]);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {userListings.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-4">
                Start selling your AI products to reach potential buyers
              </p>
              <Button 
                className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
                onClick={() => navigate('/marketplace')}
              >
                Create Your First Listing
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userListings.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    title: product.title,
                    description: product.description || "",
                    price: Number(product.price),
                    category: product.category,
                    stage: product.stage,
                    monthlyRevenue: Number(product.monthly_revenue || 0),
                    image: product.image_url || "/placeholder.svg",
                    timeLeft: "Active", 
                    seller: {
                      id: profile.id,
                      name: profile.full_name || "Anonymous",
                      avatar: profile.avatar_url || "/placeholder.svg",
                      achievements: []
                    },
                    auction_end_time: product.auction_end_time,
                    current_price: product.current_price,
                    min_price: product.min_price,
                    price_decrement: product.price_decrement
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};