
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Conversation, getConversations } from "@/integrations/supabase/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const ConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
      setLoading(false);
    };

    loadConversations();

    // Subscribe to conversation updates
    const channel = supabase
      .channel('public:conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleConversationClick = (conversationId: string) => {
    navigate(`/messages/${conversationId}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
        <p className="text-muted-foreground">
          When you make offers or win auctions, you'll be able to chat with the other party here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => {
        // Determine other party details using the current user's ID
        const getOtherPartyDetails = () => {
          const { data } = supabase.auth.getUser();
          if (!data || !data.user) {
            return {
              name: 'Unknown',
              avatar: null
            };
          }
          
          if (data.user.id === conversation.seller_id) {
            return {
              name: conversation.buyer?.full_name || 'Buyer',
              avatar: conversation.buyer?.avatar_url
            };
          } else {
            return {
              name: conversation.seller?.full_name || 'Seller',
              avatar: conversation.seller?.avatar_url
            };
          }
        };
        
        // Get the other party details synchronously
        const otherParty = getOtherPartyDetails();

        return (
          <Card
            key={conversation.id}
            className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
            onClick={() => handleConversationClick(conversation.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={otherParty.avatar || ''} />
                <AvatarFallback>
                  {otherParty.name?.substring(0, 2).toUpperCase() || '??'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium truncate">
                    {otherParty.name}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistance(new Date(conversation.last_message_at), new Date(), { 
                      addSuffix: true 
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.product?.title || 'Product discussion'}
                  </p>
                  {conversation.unread_count ? (
                    <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
                      {conversation.unread_count}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
