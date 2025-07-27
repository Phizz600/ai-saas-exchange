
import React, { RefObject } from "react";
import { Message } from "@/integrations/supabase/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistance } from "date-fns";
import DOMPurify from 'dompurify';

interface MessageListProps {
  messages: Message[];
  currentUserId: string | null | undefined;
  otherParty: { name: string; avatar: string | null };
  messagesEndRef: RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  otherParty,
  messagesEndRef,
}) => {
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>No messages yet</p>
          <p className="text-sm">Start the conversation</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => {
        const isCurrentUser = currentUserId === message.sender_id;
        const isSystemMessage = message.sender_id === "system";
        if (isSystemMessage) {
          // Sanitize system message content to prevent XSS
          const sanitizedContent = DOMPurify.sanitize(
            message.content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br/>"),
            {
              ALLOWED_TAGS: ['strong', 'br'],
              ALLOWED_ATTR: []
            }
          );
          
          return (
            <div key={message.id} className="flex justify-center">
              <div className="max-w-[90%] bg-muted rounded-lg p-3 text-center">
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: sanitizedContent,
                  }}
                />
                <p className="text-xs mt-1 text-muted-foreground">
                  {formatDistance(
                    new Date(message.created_at),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
                </p>
              </div>
            </div>
          );
        }
        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] ${isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"} rounded-lg p-3`}
            >
              <p>{message.content}</p>
              <p
                className={`text-xs mt-1 ${isCurrentUser
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
                  }`}
              >
                {formatDistance(
                  new Date(message.created_at),
                  new Date(),
                  { addSuffix: true }
                )}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageList;
