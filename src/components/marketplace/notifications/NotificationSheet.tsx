import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Database } from "@/integrations/supabase/types";

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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          {(!notifications || notifications.length === 0) ? (
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
                  onClick={() => onMarkAsRead(notification.id)}
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
  );
};