
import { cn } from '@/lib/utils';
import type { Message } from './ChatWindow';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isSystem = message.sender === 'system';
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        'flex message-appear',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2',
          isSystem && 'bg-muted text-muted-foreground text-sm',
          isUser && 'bg-primary text-primary-foreground',
          !isUser && !isSystem && 'bg-secondary text-secondary-foreground'
        )}
      >
        <p className="break-words">{message.text}</p>
        <time className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </time>
      </div>
    </div>
  );
};

export default MessageBubble;
