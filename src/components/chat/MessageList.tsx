
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import UserTypingIndicator from './UserTypingIndicator';
import { Popover, PopoverContent } from "@/components/ui/popover";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';

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
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Scroll to bottom whenever messages, typing status, or bot typing status changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current;
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
      
      // Alternative method using the lastMessageRef if the above doesn't work
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Use both setTimeout and requestAnimationFrame for more reliable scrolling
    // This ensures DOM has fully updated before attempting to scroll
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scrollToBottom);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [messages, isTyping, isBotTyping]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            onReactionClick={() => setSelectedMessageForReaction(message.id)}
            onReaction={(emoji) => handleReaction(message.id, emoji)}
            onShareClick={handleShareMessage ? () => handleShareMessage(message.id) : undefined}
            onBookmarkClick={handleBookmarkMessage ? () => handleBookmarkMessage(message.id) : undefined}
          />
        ))}
        
        {/* Only show typing indicators when someone is actually typing */}
        {isTyping && <UserTypingIndicator isUser={true} />}
        {isBotTyping && <UserTypingIndicator isBot={true} />}
        
        {/* Invisible div at the end for scrolling to the bottom */}
        <div ref={lastMessageRef} />
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
              theme={theme === 'dark' ? 'dark' as Theme : 'light' as Theme}
            />
          </PopoverContent>
        </Popover>
      )}
    </ScrollArea>
  );
};

export default MessageList;
