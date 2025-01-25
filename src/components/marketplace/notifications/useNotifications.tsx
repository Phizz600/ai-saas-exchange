import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Notification = Database['public']['Tables']['notifications']['Row'];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
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

        console.log('Fetched notifications:', notifs);
        setNotifications(notifs || []);
        setUnreadCount(notifs?.filter(n => !n.read).length || 0);
      } catch (error) {
        console.error('Error in fetchNotifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const setupNotificationSubscription = async () => {
      try {
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
      } catch (error) {
        console.error('Error in setupNotificationSubscription:', error);
      }
    };

    setupNotificationSubscription();
  }, [toast]);

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

  return {
    notifications,
    unreadCount,
    markAsRead
  };
};