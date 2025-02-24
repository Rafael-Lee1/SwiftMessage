
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from './MessageBubble';
import UserTypingIndicator from './UserTypingIndicator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Message } from '@/types/chat';
import { uploadFile } from '@/utils/fileUpload';
import { sendAiMessage } from '@/utils/aiChat';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem('chat-messages');
      return savedMessages ? JSON.parse(savedMessages, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      }) : [];
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  });

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, [messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleReaction = async (messageId: string, emoji: string) => {
    const timestamp = new Date();
    const userId = (await supabase.auth.getUser()).data.user?.id || 'anonymous';

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
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    try {
      let fileUrl = '';
      if (selectedFile) {
        try {
          fileUrl = await uploadFile(selectedFile);
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
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        ...(fileUrl && (selectedFile?.type.startsWith('image/') 
          ? { imageUrl: fileUrl }
          : { fileUrl: fileUrl }
        ))
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setSelectedFile(null);

      if (newMessage.trim().toLowerCase().startsWith('/ai')) {
        setIsBotTyping(true);
        try {
          const botResponse = await sendAiMessage(newMessage.slice(3).trim());
          
          const botMessage: Message = {
            id: crypto.randomUUID(),
            text: botResponse,
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
      }
    } catch (error: any) {
      toast({
        title: 'Error sending message',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-4 glass rounded-lg shadow-lg">
      <ChatHeader />
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onReactionClick={() => setSelectedMessageForReaction(message.id)}
              onReaction={(emoji) => handleReaction(message.id, emoji)}
            />
          ))}
          {(isTyping || isBotTyping) && <UserTypingIndicator />}
        </div>
      </ScrollArea>
      
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setIsTyping={setIsTyping}
        onSubmit={handleSend}
      />
      
      {selectedMessageForReaction && (
        <Popover open={true} onOpenChange={() => setSelectedMessageForReaction(null)}>
          <PopoverContent side="top" align="end" className="w-full p-0">
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                if (selectedMessageForReaction) {
                  handleReaction(selectedMessageForReaction, emojiData.emoji);
                }
              }}
              width="100%"
              height={400}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default ChatWindow;
