
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import UserTypingIndicator from './UserTypingIndicator';
import { Popover, PopoverContent } from "@/components/ui/popover";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMobile } from '@/hooks/use-mobile';

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
  const { resolvedTheme } = useTheme();
  const { isMobile } = useMobile();

  // Enhanced scroll to bottom function
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
    
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom whenever messages, typing status, or bot typing status changes
  useEffect(() => {
    // Using both setTimeout and requestAnimationFrame for more reliable scrolling
    // This ensures DOM has fully updated before attempting to scroll
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scrollToBottom);
      // Add another timeout to ensure we catch any delayed rendering
      setTimeout(scrollToBottom, 100);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [messages, isTyping, isBotTyping]);

  return (
    <ScrollArea 
      ref={scrollAreaRef} 
      className="flex-1 p-2 sm:p-4 pb-20 sm:pb-4 bg-gray-50 dark:bg-gray-900"
      onScroll={(e) => {
        // Add a manual scroll check - if user has scrolled up, don't auto-scroll
        const element = e.currentTarget;
        const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;
        if (!isAtBottom) {
          // User has scrolled up, don't auto-scroll
          // You might want to add a "scroll to bottom" button here
        }
      }}
    >
      <div className="space-y-3 mx-auto max-w-3xl">
        {messages.map((message, index) => (
          <div key={message.id} className="flex items-start gap-2 sm:gap-3">
            {message.sender !== 'user' && (
              <Avatar className="mt-1 h-7 w-7 sm:h-8 sm:w-8">
                <AvatarImage src="/lovable-uploads/551d19b2-4705-4bf3-86ff-0725079998cf.png" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
            )}
            <div className={`flex-1 ${message.sender === 'user' ? 'flex justify-end' : ''}`}>
              <MessageBubble
                message={message}
                onReactionClick={() => setSelectedMessageForReaction(message.id)}
                onReaction={(emoji) => handleReaction(message.id, emoji)}
                onShareClick={handleShareMessage ? () => handleShareMessage(message.id) : undefined}
                onBookmarkClick={handleBookmarkMessage ? () => handleBookmarkMessage(message.id) : undefined}
              />
            </div>
            {message.sender === 'user' && (
              <Avatar className="mt-1 h-7 w-7 sm:h-8 sm:w-8">
                <AvatarImage src="" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        
        {/* Only show typing indicators when someone is actually typing */}
        {isTyping && <UserTypingIndicator isUser={true} />}
        {isBotTyping && <UserTypingIndicator isBot={true} />}
        
        {/* Invisible div at the end for scrolling to the bottom */}
        <div ref={lastMessageRef} />
      </div>
      
      {selectedMessageForReaction && (
        <Popover open={true} onOpenChange={() => setSelectedMessageForReaction(null)}>
          <PopoverContent side="top" align="end" className="w-full md:w-auto p-0 shadow-md border-0">
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                if (selectedMessageForReaction) {
                  handleReaction(selectedMessageForReaction, emojiData.emoji);
                  setSelectedMessageForReaction(null);
                }
              }}
              width={isMobile ? "280px" : "320px"}
              height={isMobile ? 300 : 400}
              theme={resolvedTheme === 'dark' ? 'dark' as Theme : 'light' as Theme}
            />
          </PopoverContent>
        </Popover>
      )}
    </ScrollArea>
  );
};

export default MessageList;
