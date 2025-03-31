
import React from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isUser,
  timestamp,
  className,
}) => {
  return (
    <div
      className={cn(
        "mb-4 animate-fade-in",
        isUser ? "flex justify-end" : "flex justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
          isUser
            ? "bg-black text-white rounded-tr-none"
            : "bg-gray-100 text-black rounded-tl-none"
        )}
      >
        <p>{content}</p>
        <div
          className={cn(
            "text-xs mt-1",
            isUser ? "text-gray-300" : "text-gray-500"
          )}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
