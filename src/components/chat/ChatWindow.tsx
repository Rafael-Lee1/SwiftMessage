
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, Image as ImageIcon, Sun, Moon, Smile } from "lucide-react";
import MessageBubble from './MessageBubble';
import UserTypingIndicator from './UserTypingIndicator';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from 'next-themes';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type MessageReaction = {
  emoji: string;
  userId: string;
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

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to the chat! Try sending a message or asking the AI assistant a question.',
      sender: 'system',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Subscribe to presence changes
    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setOnlineUsers(new Set(Object.keys(newState)));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    // Subscribe to typing indicators
    const typingChannel = supabase.channel('typing-indicators')
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        const { user, isTyping } = payload;
        // Update typing state
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(typingChannel);
    };
  }, []);

  const handleFileUpload = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File size exceeds 5MB limit');
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('chat-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

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
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        ...(fileUrl && (selectedFile?.type.startsWith('image/') 
          ? { imageUrl: fileUrl }
          : { fileUrl: fileUrl }
        ))
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Handle AI chat with improved error handling
      if (newMessage.trim().toLowerCase().startsWith('/ai')) {
        setIsBotTyping(true);
        try {
          const { data, error } = await supabase.functions.invoke('chat-with-ai', {
            body: { message: newMessage.slice(3).trim() }
          });

          if (error) throw error;

          const botMessage: Message = {
            id: Date.now().toString(),
            text: data.response,
            sender: 'bot',
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, botMessage]);
        } catch (error: any) {
          toast({
            title: 'AI Assistant Error',
            description: 'Could not get a response. Please try again.',
            variant: 'destructive',
          });
          
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: 'Sorry, I encountered an error. Please try asking again.',
            sender: 'bot',
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, errorMessage]);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: 'File too large',
        description: 'Please select a file under 5MB',
        variant: 'destructive',
      });
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    toast({
      title: 'File selected',
      description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    });
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const userId = 'current-user'; // Replace with actual user ID
        const existingReaction = reactions.findIndex(r => r.userId === userId);
        
        if (existingReaction >= 0) {
          reactions[existingReaction].emoji = emoji;
        } else {
          reactions.push({ emoji, userId });
        }
        
        return { ...msg, reactions };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
    setSelectedMessageForReaction(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-4 glass rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-medium">AI Assistant Available</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
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
      
      <form onSubmit={handleSend} className="flex items-center gap-2 p-2">
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
        
        {selectedMessageForReaction && (
          <Popover open={true} onOpenChange={() => setSelectedMessageForReaction(null)}>
            <PopoverContent side="top" align="end" className="w-full p-0">
              <EmojiPicker
                onEmojiClick={(emojiData: EmojiClickData) => {
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
        
        <Button type="submit" size="icon" disabled={!newMessage.trim() && !selectedFile}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
