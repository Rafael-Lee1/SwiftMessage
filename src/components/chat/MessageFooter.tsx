
import { Message } from '@/types/chat';
import { Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageFooterProps {
  message: Message;
}

const MessageFooter = ({ message }: MessageFooterProps) => {
  return (
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
  );
};

export default MessageFooter;
