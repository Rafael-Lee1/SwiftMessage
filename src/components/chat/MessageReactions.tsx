
import { Button } from '@/components/ui/button';
import { MessageReaction } from '@/types/chat';

interface MessageReactionsProps {
  reactions?: MessageReaction[];
}

const MessageReactions = ({ reactions }: MessageReactionsProps) => {
  if (!reactions || reactions.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {reactions.map((reaction, index) => (
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
  );
};

export default MessageReactions;
