
import { cn } from '@/lib/utils';
import type { Message } from '@/types/chat';
import MessageContent from './MessageContent';
import MessageFooter from './MessageFooter';
import MessageReactions from './MessageReactions';
import MessageActions from './MessageActions';

interface MessageBubbleProps {
  message: Message;
  onReaction: (emoji: string) => void;
  onReactionClick: () => void;
}

const MessageBubble = ({ message, onReaction, onReactionClick }: MessageBubbleProps) => {
  const isSystem = message.sender === 'system';
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot';

  return (
    <div
      className={cn(
        'flex message-appear',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2 space-y-2 relative group',
          isSystem && 'bg-muted text-muted-foreground text-sm',
          isUser && 'bg-primary text-primary-foreground',
          isBot && 'bg-secondary text-secondary-foreground',
          !isUser && !isSystem && !isBot && 'bg-secondary text-secondary-foreground'
        )}
      >
        <MessageContent message={message} />
        <MessageFooter message={message} />
        <MessageReactions reactions={message.reactions} />
        <MessageActions onReactionClick={onReactionClick} />
      </div>
    </div>
  );
};

export default MessageBubble;
