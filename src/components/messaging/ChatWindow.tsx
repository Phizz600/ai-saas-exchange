
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Message,
  Conversation,
  getMessages,
  getConversation,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
} from "@/integrations/supabase/messages";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EscrowDialog } from "./EscrowDialog";
import { EscrowStatus } from "./EscrowStatus";
import { getEscrowTransactionByConversation } from "@/integrations/supabase/escrow";
import { EscrowPaymentDialog } from "./EscrowPaymentDialog";
import EscrowPaymentButton from "./EscrowPaymentButton";
import MessageList from "./MessageList";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

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

  // Utilities
  const loadEscrowTransaction = useCallback(async () => {
    if (!conversationId) return;
    const transaction = await getEscrowTransactionByConversation(conversationId);
    setEscrowTransaction(transaction);
  }, [conversationId]);

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
          variant: "destructive",
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
      setMessages((prev) => [...prev, newMessage]);
      markMessagesAsRead(conversationId);
    });

    // Subscribe to escrow status changes
    const escrowChannel = supabase
      .channel("escrow-status-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "escrow_transactions",
          filter: `conversation_id=eq.${conversationId}`,
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
  }, [conversationId, navigate, toast, loadEscrowTransaction]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getOtherPartyDetails = () => {
    if (!conversation || !currentUser)
      return { name: "Loading...", avatar: null };
    if (currentUser.id === conversation.seller_id) {
      return {
        name: conversation.buyer?.full_name || "Buyer",
        avatar: conversation.buyer?.avatar_url,
      };
    } else {
      return {
        name: conversation.seller?.full_name || "Seller",
        avatar: conversation.seller?.avatar_url,
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
        <button className="btn" onClick={() => navigate("/messages")}>
          Back to Messages
        </button>
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
      <ChatHeader
        otherParty={otherParty}
        conversation={conversation}
        onBack={() => navigate("/messages")}
        onCreateEscrow={handleCreateEscrow}
        showCreateEscrow={!escrowTransaction}
      />

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
          <EscrowPaymentButton
            onClick={() => setShowEscrowPaymentDialog(true)}
          />
        )}

        <MessageList
          messages={messages}
          currentUserId={currentUser?.id}
          otherParty={otherParty}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <MessageInput
        newMessage={newMessage}
        sending={sending}
        onChange={setNewMessage}
        onSend={handleSendMessage}
      />

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

export default ChatWindow;
