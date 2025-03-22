
import { supabase } from './client';

export interface Conversation {
  id: string;
  product_id: string;
  seller_id: string;
  buyer_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  last_message_at: string;
  transaction_type: 'offer' | 'auction';
  transaction_id: string;
  product?: {
    title: string;
    image_url?: string;
  };
  seller?: {
    full_name?: string;
    avatar_url?: string;
  };
  buyer?: {
    full_name?: string;
    avatar_url?: string;
  };
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

/**
 * Get all conversations for the current user
 */
export const getConversations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        product:product_id (
          title,
          image_url
        ),
        seller:seller_id (
          full_name,
          avatar_url
        ),
        buyer:buyer_id (
          full_name,
          avatar_url
        )
      `)
      .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    // Calculate unread messages count for each conversation
    const conversationsWithUnreadCount = await Promise.all(
      data.map(async (conversation) => {
        const { count, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conversation.id)
          .eq('read', false)
          .neq('sender_id', user.id);

        return {
          ...conversation,
          unread_count: countError ? 0 : count || 0
        };
      })
    );

    return conversationsWithUnreadCount;
  } catch (error) {
    console.error('Error in getConversations:', error);
    return [];
  }
};

/**
 * Get a specific conversation by ID
 */
export const getConversation = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        product:product_id (
          title,
          image_url
        ),
        seller:seller_id (
          full_name,
          avatar_url
        ),
        buyer:buyer_id (
          full_name,
          avatar_url
        )
      `)
      .eq('id', conversationId)
      .single();

    if (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getConversation:', error);
    return null;
  }
};

/**
 * Get messages for a specific conversation
 */
export const getMessages = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getMessages:', error);
    return [];
  }
};

/**
 * Send a new message in a conversation
 */
export const sendMessage = async (conversationId: string, content: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return null;
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (conversationId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .eq('read', false);

    if (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    return false;
  }
};

/**
 * Get total unread messages count
 */
export const getUnreadMessagesCount = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return 0;
    }

    // First get all conversations for the user
    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select('id')
      .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`);

    if (conversationsError || !conversationsData.length) {
      return 0;
    }

    const conversationIds = conversationsData.map(c => c.id);

    // Get total unread messages across all conversations
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .in('conversation_id', conversationIds)
      .eq('read', false)
      .neq('sender_id', user.id);

    if (error) {
      console.error('Error counting unread messages:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getUnreadMessagesCount:', error);
    return 0;
  }
};

/**
 * Subscribe to new messages in a conversation
 */
export const subscribeToMessages = (conversationId: string, callback: (message: Message) => void) => {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        const newMessage = payload.new as Message;
        callback(newMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
