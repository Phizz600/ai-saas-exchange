
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "@/integrations/supabase/messages";

interface ChatHeaderProps {
  otherParty: { name: string; avatar: string | null };
  conversation: Conversation;
  onBack: () => void;
  onCreateEscrow: () => void;
  showCreateEscrow: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  otherParty,
  conversation,
  onBack,
  onCreateEscrow,
  showCreateEscrow,
}) => (
  <div className="p-4 border-b flex items-center gap-3">
    <Button
      variant="ghost"
      size="icon"
      onClick={onBack}
      className="mr-1"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
    <Avatar className="h-10 w-10">
      <AvatarImage src={otherParty.avatar || ""} />
      <AvatarFallback>
        {otherParty.name?.substring(0, 2).toUpperCase() || "??"}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <h3 className="font-medium">{otherParty.name}</h3>
      <p className="text-xs text-muted-foreground">
        {conversation.product?.title || "Product discussion"}
      </p>
    </div>
    {showCreateEscrow && (
      <Button
        variant="outline"
        size="sm"
        onClick={onCreateEscrow}
        className="flex items-center gap-1"
      >
        <DollarSign className="h-4 w-4" />
        Create Escrow
      </Button>
    )}
  </div>
);

export default ChatHeader;
