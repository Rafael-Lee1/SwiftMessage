
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import UserTypingIndicator from './UserTypingIndicator';
import { Popover, PopoverContent } from "@/components/ui/popover";
import EmojiPicker from 'emoji-picker-react';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  isBotTyping: boolean;
  selectedMessageForReaction: string | null;
  setSelectedMessageForReaction: (messageId: string | null) => void;
  handleReaction: (messageId: string, emoji: string) => void;
  handleShareMessage?: (messageId: string) => void;
  handleBookmarkMessage?: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  isBotTyping,
  selectedMessageForReaction,
  setSelectedMessageForReaction,
  handleReaction,
  handleShareMessage,
  handleBookmarkMessage
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping, isBotTyping]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onReactionClick={() => setSelectedMessageForReaction(message.id)}
            onReaction={(emoji) => handleReaction(message.id, emoji)}
            onShareClick={handleShareMessage ? () => handleShareMessage(message.id) : undefined}
            onBookmarkClick={handleBookmarkMessage ? () => handleBookmarkMessage(message.id) : undefined}
          />
        ))}
        {(isTyping || isBotTyping) && <UserTypingIndicator />}
      </div>
      
      {selectedMessageForReaction && (
        <Popover open={true} onOpenChange={() => setSelectedMessageForReaction(null)}>
          <PopoverContent side="top" align="end" className="w-full p-0 shadow-md border-0">
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                if (selectedMessageForReaction) {
                  handleReaction(selectedMessageForReaction, emojiData.emoji);
                }
              }}
              width="100%"
              height={400}
              theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
            />
          </PopoverContent>
        </Popover>
      )}
    </ScrollArea>
  );
};

export default MessageList;
