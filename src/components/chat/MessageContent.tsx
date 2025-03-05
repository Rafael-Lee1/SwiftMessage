
import { Message } from '@/types/chat';
import { Download } from 'lucide-react';

interface MessageContentProps {
  message: Message;
}

const MessageContent = ({ message }: MessageContentProps) => {
  return (
    <>
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
    </>
  );
};

export default MessageContent;
