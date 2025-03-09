
import React, { useRef, useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Image as ImageIcon, Smile, Mic, Send } from "lucide-react";
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
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Clear typing indicator when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setIsTyping(false);
    };
  }, [setIsTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    // Reset typing indicator when message is sent
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setNewMessage(text);
    
    // Only show typing indicator if there's text
    if (text.length > 0) {
      setIsTyping(true);
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set a new timeout to clear the typing indicator after 1.5 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    } else {
      // If the input is empty, immediately hide the typing indicator
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 pl-4 pr-2 py-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-200"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
          />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-200"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-5 w-5 text-gray-500" />
        </Button>
        
        <Input
          value={newMessage}
          onChange={handleInputChange}
          placeholder={selectedFile 
            ? `File selected: ${selectedFile.name}`
            : "Type your message..."
          }
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-200"
        >
          <Smile className="h-5 w-5 text-gray-500" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-200"
        >
          <Mic className="h-5 w-5 text-gray-500" />
        </Button>
        
        <Button 
          type="submit" 
          size="icon" 
          className="rounded-full" 
          disabled={!newMessage.trim() && !selectedFile}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
