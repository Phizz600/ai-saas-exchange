
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  sending: boolean;
  onChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  sending,
  onChange,
  onSend,
}) => (
  <form onSubmit={onSend} className="p-4 border-t">
    <div className="flex gap-2">
      <Input
        value={newMessage}
        onChange={(e) => onChange(e.target.value)}
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
);

export default MessageInput;
