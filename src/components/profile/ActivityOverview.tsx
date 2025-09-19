import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Package, 
  Heart, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ActivityOverviewProps {
  profile: Profile;
}

interface UserStats {
  totalListings: number;
  totalLikes: number;
  lastUpdated: string | null;
}

interface UserListing {
  id: string;
  title: string;
  status: string;
  price: number;
  updated_at: string;
}

export const ActivityOverview = ({ profile }: ActivityOverviewProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({
    totalListings: 0,
    totalLikes: 0,
    lastUpdated: null,
  });
  const [listings, setListings] = useState<UserListing[]>([]);
  const [likedProducts, setLikedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityData();
  }, [profile.id]);

  const fetchActivityData = async () => {
    try {
      // Fetch user listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('products')
        .select('id, title, status, price, updated_at')
        .eq('seller_id', profile.id)
        .order('updated_at', { ascending: false });

      if (listingsError) {
        console.error('Error fetching listings:', listingsError);
      }

      // Fetch liked products
      const likedProductIds = profile.liked_products || [];
      let likedProductsData: any[] = [];
      
      if (likedProductIds.length > 0) {
        const { data: likedData, error: likedError } = await supabase
          .from('products')
          .select('id, title, price, updated_at')
          .in('id', likedProductIds)
          .order('updated_at', { ascending: false });

        if (likedError) {
          console.error('Error fetching liked products:', likedError);
        } else {
          likedProductsData = likedData || [];
        }
      }

      // Calculate stats
      const totalListings = listingsData?.length || 0;
      const totalLikes = likedProductsData.length;
      const lastUpdated = listingsData?.[0]?.updated_at || likedProductsData?.[0]?.updated_at || null;

      setStats({
        totalListings,
        totalLikes,
        lastUpdated,
      });

      setListings(listingsData || []);
      setLikedProducts(likedProductsData);
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading activity...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Activity Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stats.totalListings}</div>
                <div className="text-sm text-muted-foreground">Total Listings</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold">{stats.totalLikes}</div>
                <div className="text-sm text-muted-foreground">Liked Products</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">
                  {stats.lastUpdated ? formatDate(stats.lastUpdated) : 'No activity'}
                </div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="listings" className="space-y-4">
            {listings.length > 0 ? (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{listing.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                          {listing.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatPrice(listing.price)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          • Updated {formatDate(listing.updated_at)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/product/${listing.id}`)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start selling by creating your first product listing.
                </p>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/list-product')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Sell My AI SaaS
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="likes" className="space-y-4">
            {likedProducts.length > 0 ? (
              <div className="space-y-3">
                {likedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          • Liked {formatDate(product.updated_at)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No liked products</h3>
                <p className="text-muted-foreground mb-4">
                  Start exploring and like products you're interested in.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/marketplace')}
                >
                  Browse Marketplace
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
