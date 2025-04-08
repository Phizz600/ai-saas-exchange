
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

type Notification = Database['public']['Tables']['notifications']['Row'];

interface NotificationSheetProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (notificationId: string) => Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NotificationSheet = ({ 
  notifications = [], 
  unreadCount = 0, 
  onMarkAsRead,
  open,
  onOpenChange
}: NotificationSheetProps) => {
  // Helper function to get appropriate background color based on notification type
  const getNotificationBgColor = (type: string, read: boolean | null) => {
    if (read) return 'bg-background';
    
    switch (type) {
      case 'auction_ending_soon':
        return 'bg-amber-50';
      case 'auction_ended':
        return 'bg-blue-50';
      case 'new_bid':
        return 'bg-green-50';
      case 'outbid':
        return 'bg-red-50';
      case 'product_saved':
        return 'bg-purple-50';
      case 'product_liked':
        return 'bg-pink-50';
      case 'sale':
        return 'bg-emerald-50';
      default:
        return 'bg-[#8B5CF6]/5';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative p-2">
          <Bell className="h-5 w-5 text-[#0EA4E9]" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-xl font-semibold exo-2-header">Notifications</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-85px)]">
          <div className="p-6">
            {(!notifications || notifications.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No notifications yet
                </p>
                <p className="text-sm text-muted-foreground/70">
                  When you get notifications, they'll show up here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-accent ${
                      getNotificationBgColor(notification.type, notification.read)
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <h4 className="font-semibold text-black hover:text-white transition-colors">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-[#0EA4E9] mt-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground/70 mt-2 block">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
