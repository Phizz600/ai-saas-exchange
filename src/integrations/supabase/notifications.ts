
import { supabase } from "./client";
import { Database } from "./types";

type NotificationType = 
  | 'outbid' 
  | 'price_decrease' 
  | 'auction_ending_soon' 
  | 'auction_ended'
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'message_received'
  | 'product_sold';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  related_product_id?: string;
  related_bid_id?: string;
}

// Function to fetch notifications for a user
export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  
  return data as Notification[];
};

// Function to mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
    
  if (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
  
  return true;
};

// Function to mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return false;
  }
  
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', session.user.id)
    .eq('read', false);
    
  if (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
  
  return true;
};

// Function to create a bid notification (called when someone places a higher bid)
export const createOutbidNotification = async (
  userId: string,
  productId: string,
  productTitle: string,
  newBidAmount: number
): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title: "You've been outbid!",
      message: `Someone placed a higher bid of $${newBidAmount.toLocaleString()} on ${productTitle}`,
      type: 'outbid',
      related_product_id: productId,
      read: false
    });
    
  if (error) {
    console.error("Error creating outbid notification:", error);
    return false;
  }
  
  return true;
};

// Function to subscribe to notifications (real-time)
export const subscribeToNotifications = (
  onNewNotification: (notification: Notification) => void
) => {
  const channel = supabase
    .channel('user-notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      },
      (payload) => {
        const newNotification = payload.new as Notification;
        onNewNotification(newNotification);
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};
