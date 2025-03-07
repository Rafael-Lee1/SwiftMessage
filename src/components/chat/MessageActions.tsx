
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SmileIcon, Share2Icon, BookmarkIcon } from 'lucide-react';

interface MessageActionsProps {
  onReactionClick: () => void;
  onShareClick?: () => void;
  onBookmarkClick?: () => void;
}

const MessageActions = ({ 
  onReactionClick, 
  onShareClick, 
  onBookmarkClick 
}: MessageActionsProps) => {
  return (
    <div className="absolute -right-24 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={onReactionClick}
            >
              <SmileIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Add reaction</p>
          </TooltipContent>
        </Tooltip>

        {onShareClick && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={onShareClick}
              >
                <Share2Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Share message</p>
            </TooltipContent>
          </Tooltip>
        )}

        {onBookmarkClick && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={onBookmarkClick}
              >
                <BookmarkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Save message</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default MessageActions;
