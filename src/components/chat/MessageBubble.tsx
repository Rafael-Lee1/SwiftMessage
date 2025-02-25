
import { cn } from '@/lib/utils';
import type { Message } from '@/types/chat';
import { Check, Download, SmileIcon } from 'lucide-react';
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
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Shared image"
            className="rounded-lg max-w-full h-auto"
            loading="lazy"
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
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-6 px-2 py-0 rounded-full bg-muted/50 hover:bg-muted"
              >
                {reaction.emoji}
              </Button>
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onReactionClick}
        >
          <SmileIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageBubble;
