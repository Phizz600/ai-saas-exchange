import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Message, 
  Conversation, 
  getMessages, 
  getConversation, 
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages
} from "@/integrations/supabase/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, DollarSign } from "lucide-react";
import { formatDistance } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EscrowDialog } from "./EscrowDialog";
import { EscrowStatus } from "./EscrowStatus";
import { getEscrowTransactionByConversation } from "@/integrations/supabase/escrow";
import { EscrowPaymentDialog } from "./EscrowPaymentDialog";

export const ChatWindow = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [escrowDialogOpen, setEscrowDialogOpen] = useState(false);
  const [escrowTransaction, setEscrowTransaction] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEscrowPaymentDialog, setShowEscrowPaymentDialog] = useState(false);

  const loadEscrowTransaction = async () => {
    if (!conversationId) return;
    const transaction = await getEscrowTransactionByConversation(conversationId);
    setEscrowTransaction(transaction);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    
    const loadConversation = async () => {
      setLoading(true);
      const conversationData = await getConversation(conversationId);
      if (!conversationData) {
        toast({
          title: "Error",
          description: "Conversation not found",
          variant: "destructive"
        });
        navigate("/messages");
        return;
      }
      setConversation(conversationData);
      
      const messagesData = await getMessages(conversationId);
      setMessages(messagesData);
      
      // Mark messages as read
      await markMessagesAsRead(conversationId);

      // Load escrow transaction if any
      await loadEscrowTransaction();
      
      setLoading(false);
    };
    
    loadConversation();
    
    // Subscribe to new messages
    const unsubscribe = subscribeToMessages(conversationId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      markMessagesAsRead(conversationId);
    });
    
    // Subscribe to escrow status changes
    const escrowChannel = supabase
      .channel('escrow-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'escrow_transactions',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          // Reload the escrow transaction when its status changes
          loadEscrowTransaction();
        }
      )
      .subscribe();
    
    return () => {
      unsubscribe();
      supabase.removeChannel(escrowChannel);
    };
  }, [conversationId, navigate, toast]);
  
  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || sending) return;
    
    try {
      setSending(true);
      const result = await sendMessage(conversationId, newMessage);
      if (result) {
        setNewMessage("");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const getOtherPartyDetails = () => {
    if (!conversation || !currentUser) return { name: 'Loading...', avatar: null };
    
    if (currentUser.id === conversation.seller_id) {
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

  const handleCreateEscrow = () => {
    setEscrowDialogOpen(true);
  };

  const handleEscrowStatusChange = () => {
    loadEscrowTransaction();
  };

  const getUserRole = (): "buyer" | "seller" => {
    if (!currentUser || !conversation) return "buyer";
    return currentUser.id === conversation.seller_id ? "seller" : "buyer";
  };

  // Get the last 5 messages for analysis by the escrow dialog
  const getLastMessages = () => {
    if (!messages || messages.length === 0) return [];
    return messages.slice(-5);
  };

  if (loading) {
    return (
      <Card className="h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading conversation...</p>
        </div>
      </Card>
    );
  }

  if (!conversation) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Conversation not found</h3>
        <Button onClick={() => navigate("/messages")}>Back to Messages</Button>
      </Card>
    );
  }

  const otherParty = getOtherPartyDetails();
  const userRole = getUserRole();

  // Show escrow payment button to buyer when agreement_reached but not payment_secured
  const showBuyerEscrowPaymentButton =
    userRole === "buyer" &&
    escrowTransaction &&
    escrowTransaction.status === "agreement_reached";

  return (
    <Card className="h-[calc(100vh-10rem)] flex flex-col">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/messages")}
          className="mr-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherParty.avatar || ''} />
          <AvatarFallback>
            {otherParty.name?.substring(0, 2).toUpperCase() || '??'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium">{otherParty.name}</h3>
          <p className="text-xs text-muted-foreground">
            {conversation.product?.title || 'Product discussion'}
          </p>
        </div>
        {!escrowTransaction && (
          <Button 
            variant="outline"
            size="sm"
            onClick={handleCreateEscrow}
            className="flex items-center gap-1"
          >
            <DollarSign className="h-4 w-4" />
            Create Escrow
          </Button>
        )}
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {escrowTransaction && (
          <EscrowStatus 
            transaction={escrowTransaction} 
            userRole={userRole} 
            conversationId={conversationId || ""}
            onStatusChange={handleEscrowStatusChange}
          />
        )}

        {showBuyerEscrowPaymentButton && (
          <div className="flex justify-center mb-6">
            <Button
              className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white font-semibold px-8 py-3 shadow-lg rounded-lg"
              size="lg"
              onClick={() => setShowEscrowPaymentDialog(true)}
            >
              Initiate Escrow Payment
            </Button>
          </div>
        )}
        
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = currentUser?.id === message.sender_id;
            const isSystemMessage = message.sender_id === 'system';
            
            // Special rendering for system messages
            if (isSystemMessage) {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="max-w-[90%] bg-muted rounded-lg p-3 text-center">
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                    <p className="text-xs mt-1 text-muted-foreground">
                      {formatDistance(new Date(message.created_at), new Date(), { 
                        addSuffix: true 
                      })}
                    </p>
                  </div>
                </div>
              );
            }
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isCurrentUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary'} rounded-lg p-3`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${isCurrentUser 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'}`}
                  >
                    {formatDistance(new Date(message.created_at), new Date(), { 
                      addSuffix: true 
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1"
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Escrow dialog */}
      <EscrowDialog 
        open={escrowDialogOpen}
        onOpenChange={setEscrowDialogOpen}
        conversationId={conversationId || ""}
        productTitle={conversation.product?.title || "Product"}
        lastMessages={getLastMessages()}
      />

      {/* Escrow Payment dialog */}
      {escrowTransaction && (
        <EscrowPaymentDialog
          open={showEscrowPaymentDialog}
          onOpenChange={setShowEscrowPaymentDialog}
          transaction={escrowTransaction}
          onStatusChange={handleEscrowStatusChange}
        />
      )}
    </Card>
  );
};
