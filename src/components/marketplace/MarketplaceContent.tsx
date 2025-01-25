import { useState, useEffect } from "react";
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Bell } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockProducts } from "@/data/mockProducts";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { incrementProductViews } from "@/integrations/supabase/functions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type Product = Database['public']['Tables']['products']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];

export const MarketplaceContent = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('No authenticated user found');
        return;
      }

      const { data: notifs, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(notifs || []);
      setUnreadCount(notifs?.filter(n => !n.read).length || 0);
    };

    fetchNotifications();
  }, []);

  // Subscribe to new notifications
  useEffect(() => {
    const setupNotificationSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('No authenticated user found for notification subscription');
        return;
      }

      console.log('Setting up real-time subscription for notifications');
      
      const channel = supabase
        .channel('public:notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload) => {
            console.log('New notification received:', payload);
            const newNotification = payload.new as Notification;
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        )
        .subscribe();

      return () => {
        console.log('Cleaning up notification subscription');
        supabase.removeChannel(channel);
      };
    };

    setupNotificationSubscription();
  }, [toast]);

  // Track product views
  const trackProductView = async (productId: string) => {
    try {
      await incrementProductViews(productId);
      console.log('Product view tracked:', productId);
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Subscribe to new products
  useEffect(() => {
    console.log('Setting up real-time subscription for products');
    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('New product received:', payload);
          const newProduct = payload.new as Product;
          
          setProducts(prevProducts => {
            console.log('Adding new product to state:', newProduct);
            return [...prevProducts, newProduct];
          });
          
          toast({
            title: "New Product Listed",
            description: `${newProduct.title} has been added to the marketplace`,
          });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Transform data to include all required fields
  const currentItems = products.map(product => ({
    ...product,
    id: String(product.id),
    monthly_revenue: product.monthly_revenue || 0,
    monthly_traffic: product.monthly_traffic || 0,
    image_url: product.image_url || "/placeholder.svg",
  }));
  
  const totalPages = 1;
  const isLoading = false;
  const error = null;

  if (error) {
    console.error('MarketplaceContent error:', error);
    toast({
      variant: "destructive",
      title: "Error loading products",
      description: "Please try again later.",
    });

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was an error loading the marketplace products. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          industryFilter={industryFilter}
          setIndustryFilter={setIndustryFilter}
          stageFilter={stageFilter}
          setStageFilter={setStageFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isLoading={false}
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-100px)] mt-4">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No notifications yet
                </p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-background' : 'bg-muted'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <ProductGrid 
        products={products} 
        isLoading={false} 
        onProductView={trackProductView}
      />

      {!false && products.length > 0 && (
        <MarketplacePagination
          currentPage={currentPage}
          totalPages={1}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};
