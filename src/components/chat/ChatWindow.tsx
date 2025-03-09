
import React, { useState, useEffect } from 'react';
import type { Message } from '@/types/chat';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchAIResponse } from '@/utils/chat/aiUtils';
import { fetchClaudeResponse } from '@/utils/chat/claudeUtils';
import { fetchGeminiResponse } from '@/utils/chat/geminiUtils';
import { handleFileUpload } from '@/utils/chat/fileUtils';
import { loadMessagesFromLocalStorage, saveMessagesToLocalStorage } from '@/utils/chat/storageUtils';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

const ChatWindow = () => {
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
      const { data } = await supabase.auth.getUser();
      const userId = data?.user?.id || 'anonymous';

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

  const handleSend = async (newMessageText: string, selectedFile: File | null) => {
    try {
      let fileUrl = '';
      if (selectedFile) {
        try {
          fileUrl = await handleFileUpload(selectedFile);
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

      if (newMessageText.trim().toLowerCase().startsWith('/ai')) {
        setIsBotTyping(true);
        try {
          const aiResponse = await fetchAIResponse(newMessageText);
          
          const botMessage: Message = {
            id: crypto.randomUUID(),
            text: aiResponse,
            sender: 'bot',
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, botMessage]);
        } catch (error) {
          console.error('AI chat error:', error);
          toast({
            title: 'AI Assistant Error',
            description: 'Could not get a response. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsBotTyping(false);
        }
      } else if (newMessageText.trim().toLowerCase().startsWith('/claude')) {
        setIsBotTyping(true);
        try {
          const claudeResponse = await fetchClaudeResponse(newMessageText.slice(7).trim());
          
          const botMessage: Message = {
            id: crypto.randomUUID(),
            text: claudeResponse,
            sender: 'bot',
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, botMessage]);
        } catch (error) {
          console.error('Claude chat error:', error);
          toast({
            title: 'Claude Assistant Error',
            description: 'Could not get a response. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsBotTyping(false);
        }
      } else if (newMessageText.trim().toLowerCase().startsWith('/gemini')) {
        setIsBotTyping(true);
        try {
          const geminiResponse = await fetchGeminiResponse(newMessageText.slice(8).trim());
          
          const botMessage: Message = {
            id: crypto.randomUUID(),
            text: geminiResponse,
            sender: 'bot',
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, botMessage]);
        } catch (error) {
          console.error('Gemini chat error:', error);
          toast({
            title: 'Gemini Assistant Error',
            description: 'Could not get a response. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsBotTyping(false);
        }
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-4 glass rounded-lg shadow-lg">
      <ChatHeader isBotAvailable={true} />
      
      <MessageList 
        messages={messages}
        isTyping={isTyping}
        isBotTyping={isBotTyping}
        selectedMessageForReaction={selectedMessageForReaction}
        setSelectedMessageForReaction={setSelectedMessageForReaction}
        handleReaction={handleReaction}
        handleShareMessage={handleShareMessage}
        handleBookmarkMessage={handleBookmarkMessage}
      />
      
      <ChatInput 
        onSendMessage={handleSend}
        isTyping={isTyping}
        setIsTyping={setIsTyping}
      />
    </div>
  );
};

export default ChatWindow;
