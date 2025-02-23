
import { cn } from '@/lib/utils';
import type { Message } from './ChatWindow';
import { Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageBubbleProps {
  message: Message;
  onReaction: (emoji: string) => void;
}

const MessageBubble = ({ message, onReaction }: MessageBubbleProps) => {
  const isSystem = message.sender === 'system';
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot';

  const handleReactionClick = (emoji: string) => {
    onReaction(emoji);
  };

  return (
    <div
      className={cn(
        'flex message-appear',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2 space-y-2',
          isSystem && 'bg-muted text-muted-foreground text-sm',
          isUser && 'bg-primary text-primary-foreground',
          isBot && 'bg-secondary text-secondary-foreground',
          !isUser && !isSystem && !isBot && 'bg-secondary text-secondary-foreground'
        )}
      >
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Shared image"
            className="rounded-lg max-w-full h-auto"
          />
        )}
        
        {message.fileUrl && (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <Download className="h-4 w-4" />
            Download File
          </a>
        )}
        
        <p className="break-words">{message.text}</p>
        
        <div className="flex items-center justify-between gap-2 mt-1">
          <time className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString()}
          </time>
          
          {message.read && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex">
                    <Check className="h-3 w-3" />
                    <Check className="h-3 w-3 -ml-1" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Read</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-6 px-1 py-0"
                onClick={() => handleReactionClick(reaction.emoji)}
              >
                {reaction.emoji}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
