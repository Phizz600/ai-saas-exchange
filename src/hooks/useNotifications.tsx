
import { useState, useEffect, useCallback } from "react";
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  subscribeToNotifications,
  Notification
} from "@/integrations/supabase/notifications";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch notifications
  const getNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark a notification as read
  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    }
  }, []);

  // Handle real-time updates
  useEffect(() => {
    getNotifications();

    // Subscribe to new notifications
    const unsubscribe = subscribeToNotifications((newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show a toast for outbid notifications
      if (newNotification.type === 'outbid') {
        toast({
          title: "You've been outbid!",
          description: newNotification.message,
          variant: "destructive",
        });
      } else if (newNotification.type === 'price_decrease') {
        toast({
          title: "Price Drop Alert",
          description: newNotification.message,
        });
      } else if (newNotification.type === 'auction_ending_soon') {
        toast({
          title: "Auction Ending Soon",
          description: newNotification.message,
          variant: "default",
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [getNotifications, toast]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    refreshNotifications: getNotifications
  };
}
