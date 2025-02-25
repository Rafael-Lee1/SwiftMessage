
export type MessageReaction = {
  emoji: string;
  userId: string;
  timestamp: Date;
};

export type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  read?: boolean;
  reactions?: MessageReaction[];
  imageUrl?: string;
  fileUrl?: string;
};
