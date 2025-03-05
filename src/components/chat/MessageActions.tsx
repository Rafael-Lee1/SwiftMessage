
import { Button } from '@/components/ui/button';
import { SmileIcon } from 'lucide-react';

interface MessageActionsProps {
  onReactionClick: () => void;
}

const MessageActions = ({ onReactionClick }: MessageActionsProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={onReactionClick}
    >
      <SmileIcon className="h-4 w-4" />
    </Button>
  );
};

export default MessageActions;
