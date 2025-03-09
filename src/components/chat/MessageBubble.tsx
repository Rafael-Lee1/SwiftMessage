
import { cn } from '@/lib/utils';
import type { Message } from '@/types/chat';
import MessageContent from './MessageContent';
import MessageFooter from './MessageFooter';
import MessageReactions from './MessageReactions';
import MessageActions from './MessageActions';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MessageBubbleProps {
  message: Message;
  onReaction: (emoji: string) => void;
  onReactionClick: () => void;
  onShareClick?: () => void;
  onBookmarkClick?: () => void;
}

const MessageBubble = ({ 
  message, 
  onReaction, 
  onReactionClick,
  onShareClick,
  onBookmarkClick
}: MessageBubbleProps) => {
  const isSystem = message.sender === 'system';
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot';
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Fetch the current user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentUserId(data.user.id);
      }
    };
    
    fetchUserId();
  }, []);

  return (
    <div
      className={cn(
        'message-appear max-w-[70%]',
        isUser ? 'ml-auto' : ''
      )}
    >
      <div
        className={cn(
          'rounded-2xl px-4 py-2 space-y-2 relative group',
          isSystem && 'bg-muted text-muted-foreground text-sm',
          isUser && 'bg-primary text-primary-foreground',
          isBot && 'bg-white border border-gray-200 text-gray-800',
          !isUser && !isSystem && !isBot && 'bg-white border border-gray-200 text-gray-800'
        )}
      >
        <MessageContent message={message} />
        <MessageFooter message={message} />
        <MessageReactions 
          reactions={message.reactions} 
          onReactionClick={onReaction}
          currentUserId={currentUserId}
        />
        <MessageActions 
          onReactionClick={onReactionClick} 
          onShareClick={onShareClick}
          onBookmarkClick={onBookmarkClick}
        />
      </div>
    </div>
  );
};

export default MessageBubble;
