import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Heart, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MockActivityOverviewProps {
  profile: {
    id: string;
    user_type: string | null;
    liked_products?: string[];
  };
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

export const MockActivityOverview = ({ profile }: MockActivityOverviewProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({
    totalListings: 0,
    totalLikes: 0,
    lastUpdated: null,
  });
  const [listings, setListings] = useState<UserListing[]>([]);
  const [likedProducts, setLikedProducts] = useState<any[]>([]);

  useEffect(() => {
    // Mock realistic data
    const mockListings: UserListing[] = [
      {
        id: "listing-1",
        title: "AI Content Generator",
        status: "active",
        price: 25000,
        updated_at: "2024-01-20T15:30:00Z"
      },
      {
        id: "listing-2", 
        title: "Smart Analytics Dashboard",
        status: "active",
        price: 45000,
        updated_at: "2024-01-18T10:15:00Z"
      },
      {
        id: "listing-3",
        title: "Customer Support Bot",
        status: "draft",
        price: 18000,
        updated_at: "2024-01-19T14:45:00Z"
      }
    ];

    const mockLikedProducts = [
      {
        id: "liked-1",
        title: "ML Prediction Engine",
        price: 35000,
        updated_at: "2024-01-19T09:20:00Z"
      },
      {
        id: "liked-2",
        title: "Automated Testing Suite", 
        price: 22000,
        updated_at: "2024-01-18T16:30:00Z"
      },
      {
        id: "liked-3",
        title: "Data Visualization Tool",
        price: 28000,
        updated_at: "2024-01-17T11:45:00Z"
      },
      {
        id: "liked-4",
        title: "Chatbot Platform",
        price: 32000,
        updated_at: "2024-01-16T13:15:00Z"
      },
      {
        id: "liked-5",
        title: "Recommendation System",
        price: 40000,
        updated_at: "2024-01-15T08:30:00Z"
      }
    ];

    // Calculate stats
    const totalListings = mockListings.length;
    const totalLikes = profile.liked_products?.length || mockLikedProducts.length;
    const lastUpdated = mockListings[0]?.updated_at || mockLikedProducts[0]?.updated_at || null;

    setStats({
      totalListings,
      totalLikes,
      lastUpdated,
    });

    setListings(mockListings);
    setLikedProducts(mockLikedProducts);
  }, [profile]);

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
                {profile.user_type === "ai_builder" && (
                  <Button
                    onClick={() => navigate('/list-product')}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Listing
                  </Button>
                )}
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

