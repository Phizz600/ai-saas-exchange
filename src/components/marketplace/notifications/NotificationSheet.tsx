
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

// Define a custom type that extends the database notification type to include 'escrow_update'
type NotificationType = Database['public']['Tables']['notifications']['Row']['type'] | 'escrow_update';
type Notification = Omit<Database['public']['Tables']['notifications']['Row'], 'type'> & { type: NotificationType };

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
  const getNotificationBgColor = (type: NotificationType, read: boolean | null, title: string) => {
    if (read) return 'bg-background';
    if (type === 'escrow_update') {
      // For key seller actions, use stronger highlight
      if (
        title.includes('Delivery') ||
        title.includes('Disputed')
      ) {
        return 'bg-red-50 border-red-200';
      }
      if (
        title.includes('Payment Received') ||
        title.includes('Escrow Created')
      ) {
        return 'bg-green-50 border-green-200';
      }
      if (title.includes('Escrow Completed')) {
        return 'bg-emerald-50 border-emerald-200';
      }
      return 'bg-indigo-50 border-indigo-200';
    }

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

  // Helper: extract action button if notification is actionable
  const renderActionButton = (notification: Notification) => {
    if (
      notification.type === 'escrow_update' &&
      notification.title &&
      notification.title.includes('Delivery')
    ) {
      return (
        <Button
          size="sm"
          className="mt-2 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
          onClick={e => {
            e.stopPropagation();
            // Navigate to conversation/messages page
            window.location.href = '/messages'; // Could direct to conversation
          }}
        >
          Deliver Product
        </Button>
      );
    }
    if (
      notification.type === 'escrow_update' &&
      notification.title &&
      notification.title.includes('Disputed')
    ) {
      return (
        <Button
          size="sm"
          className="mt-2 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
          onClick={e => {
            e.stopPropagation();
            window.location.href = '/messages';
          }}
        >
          View Dispute
        </Button>
      );
    }
    // Extend for other actions if needed
    return null;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-xl font-semibold exo-2-header">Notifications</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-85px)]">
          <div className="p-6">
            {!notifications || notifications.length === 0 ? (
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
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-accent ${getNotificationBgColor(notification.type, notification.read, notification.title)}`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <h4 className={`font-semibold ${notification.type === 'escrow_update' ? 'text-[#8B5CF6]' : 'text-black'} hover:text-white transition-colors`}>
                      {notification.title}
                    </h4>
                    <p className="text-sm mt-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground/70 mt-2 block">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                    {renderActionButton(notification)}
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
