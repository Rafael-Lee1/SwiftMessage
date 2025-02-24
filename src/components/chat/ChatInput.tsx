
import { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateFile } from "@/utils/fileUpload";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  setIsTyping: (isTyping: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput = ({
  newMessage,
  setNewMessage,
  selectedFile,
  setSelectedFile,
  setIsTyping,
  onSubmit
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      setSelectedFile(file);
      toast({
        title: 'File selected',
        description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
      });
    }
    
    e.target.value = '';
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 p-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon className="h-5 w-5" />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
        />
      </Button>
      
      <Input
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
          setIsTyping(e.target.value.length > 0);
        }}
        placeholder={selectedFile 
          ? `File selected: ${selectedFile.name}`
          : "Type a message... (Use /ai to chat with AI)"
        }
        className="bg-background/50"
      />
      
      <Button type="submit" size="icon" disabled={!newMessage.trim() && !selectedFile}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
