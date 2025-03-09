
import React, { useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Image as ImageIcon } from "lucide-react";
import { validateFile } from '@/utils/chat/fileUtils';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (text: string, file: File | null) => Promise<void>;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isTyping, 
  setIsTyping 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    try {
      await onSendMessage(newMessage, selectedFile);
      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast({
        title: 'Error sending message',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

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
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
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
          : "Type a message... (Use /ai, /claude, or /gemini to chat with AI)"
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
