
import { Button } from '@/components/ui/button';
import { MessageReaction } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MessageReactionsProps {
  reactions?: MessageReaction[];
  onReactionClick?: (emoji: string) => void;
  currentUserId?: string;
}

const MessageReactions = ({ 
  reactions = [], 
  onReactionClick,
  currentUserId 
}: MessageReactionsProps) => {
  const { toast } = useToast();
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  
  if (!reactions || reactions.length === 0) return null;
  
  // Group reactions by emoji
  const emojiCounts: Record<string, {count: number, users: string[]}> = {};
  
  reactions.forEach(reaction => {
    if (!emojiCounts[reaction.emoji]) {
      emojiCounts[reaction.emoji] = {
        count: 0,
        users: []
      };
    }
    emojiCounts[reaction.emoji].count += 1;
    emojiCounts[reaction.emoji].users.push(reaction.userId);
  });

  const handleReactionClick = (emoji: string) => {
    if (onReactionClick) {
      onReactionClick(emoji);
    } else {
      toast({
        title: "Reaction added",
        description: `You reacted with ${emoji}`,
      });
    }
  };
  
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      <TooltipProvider>
        {Object.entries(emojiCounts).map(([emoji, data]) => {
          const { count, users } = data;
          const hasUserReacted = currentUserId && users.includes(currentUserId);
          
          return (
            <Tooltip key={emoji}>
              <TooltipTrigger asChild>
                <Button
                  variant={hasUserReacted ? "default" : "ghost"}
                  size="sm"
                  className={`h-6 px-2 py-0 rounded-full ${hasUserReacted ? 'bg-primary/20' : 'bg-muted/50'} hover:bg-muted`}
                  onClick={() => handleReactionClick(emoji)}
                  onMouseEnter={() => setHoveredReaction(emoji)}
                  onMouseLeave={() => setHoveredReaction(null)}
                >
                  <span className="mr-1">{emoji}</span>
                  <Badge variant="outline" className="h-4 px-1 text-xs font-normal">
                    {count}
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {users.length > 3 
                    ? `${users.slice(0, 3).join(', ')} and ${users.length - 3} more`
                    : users.join(', ')}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
};

export default MessageReactions;
