
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Message } from '@/types/chat';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { loadMessagesFromLocalStorage, saveMessagesToLocalStorage } from '@/utils/chat/storageUtils';

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  isBotTyping: boolean;
  setIsBotTyping: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMessageForReaction: string | null;
  setSelectedMessageForReaction: React.Dispatch<React.SetStateAction<string | null>>;
  handleReaction: (messageId: string, emoji: string) => Promise<void>;
  handleShareMessage: (messageId: string) => void;
  handleBookmarkMessage: (messageId: string) => void;
  handleSend: (newMessageText: string, selectedFile: File | null) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(loadMessagesFromLocalStorage);
  const [isTyping, setIsTyping] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState<string | null>(null);
  const { toast } = useToast();
  const { setTheme } = useTheme();

  useEffect(() => {
    saveMessagesToLocalStorage(messages);
  }, [messages]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const timestamp = new Date();
      // For now, use anonymous until we have proper user management
      const userId = 'anonymous';

      setMessages(prevMessages => 
        prevMessages.map(msg => {
          if (msg.id === messageId) {
            const reactions = [...(msg.reactions || [])];
            const existingReactionIndex = reactions.findIndex(r => r.userId === userId);
            
            if (existingReactionIndex >= 0) {
              reactions[existingReactionIndex] = { emoji, userId, timestamp };
            } else {
              reactions.push({ emoji, userId, timestamp });
            }
            
            return { ...msg, reactions };
          }
          return msg;
        })
      );
      
      setSelectedMessageForReaction(null);
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: 'Error adding reaction',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleShareMessage = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      navigator.clipboard.writeText(message.text);
      toast({
        title: "Message copied to clipboard",
        description: "You can now share it with others"
      });
    }
  };

  const handleBookmarkMessage = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedMessages') || '[]');
      if (!bookmarks.some((bookmark: Message) => bookmark.id === messageId)) {
        bookmarks.push(message);
        localStorage.setItem('bookmarkedMessages', JSON.stringify(bookmarks));
        toast({
          title: "Message bookmarked",
          description: "You can access it later from your bookmarks"
        });
      } else {
        toast({
          title: "Already bookmarked",
          description: "This message is already in your bookmarks"
        });
      }
    }
  };

  // Import to a separate utility later
  const handleSend = async (newMessageText: string, selectedFile: File | null) => {
    try {
      const fileHandlingService = await import('@/services/FileHandlingService');
      const messageService = await import('@/services/MessageService');

      let fileUrl = '';
      if (selectedFile) {
        try {
          fileUrl = await fileHandlingService.default.uploadFile(selectedFile);
        } catch (error: any) {
          toast({
            title: 'Error uploading file',
            description: error.message || 'Please try again',
            variant: 'destructive',
          });
          return;
        }
      }

      const message: Message = {
        id: crypto.randomUUID(),
        text: newMessageText,
        sender: 'user',
        timestamp: new Date(),
        ...(fileUrl && (selectedFile?.type.startsWith('image/') 
          ? { imageUrl: fileUrl }
          : { fileUrl: fileUrl }
        ))
      };

      setMessages(prev => [...prev, message]);

      if (newMessageText.trim().toLowerCase().startsWith('/gemini')) {
        await messageService.default.sendGeminiMessage(
          newMessageText.slice(8).trim(),
          setIsBotTyping,
          setMessages,
          toast
        );
      } else if (newMessageText.trim().toLowerCase().startsWith('/ai')) {
        await messageService.default.sendAIMessage(
          newMessageText,
          setIsBotTyping,
          setMessages,
          toast
        );
      } else if (newMessageText.trim().toLowerCase().startsWith('/claude')) {
        await messageService.default.sendClaudeMessage(
          newMessageText.slice(7).trim(),
          setIsBotTyping,
          setMessages,
          toast
        );
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const value = {
    messages,
    setMessages,
    isTyping,
    setIsTyping,
    isBotTyping,
    setIsBotTyping,
    selectedMessageForReaction,
    setSelectedMessageForReaction,
    handleReaction,
    handleShareMessage,
    handleBookmarkMessage,
    handleSend,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
