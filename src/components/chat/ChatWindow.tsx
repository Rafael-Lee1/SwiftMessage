
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, Image as ImageIcon, Sun, Moon } from "lucide-react";
import MessageBubble from './MessageBubble';
import UserTypingIndicator from './UserTypingIndicator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from 'next-themes';
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverContent } from "@/components/ui/popover";
import type { Message } from '@/types/chat';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = {
  'image/jpeg': true,
  'image/png': true,
  'image/gif': true,
  'application/pdf': true,
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
};

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem('chat-messages');
      return savedMessages ? JSON.parse(savedMessages, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      }) : [{
        id: '1',
        text: 'Welcome to the chat! Try sending a message or asking the AI assistant a question.',
        sender: 'system',
        timestamp: new Date(),
      }];
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Save messages to localStorage with proper date handling
  useEffect(() => {
    try {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, [messages]);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const validateFile = (file: File): boolean => {
    if (!file) return false;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please select a file under 5MB',
        variant: 'destructive',
      });
      return false;
    }

    if (!ALLOWED_FILE_TYPES[file.type]) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image, PDF, or Word document',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    toast({
      title: 'Theme Changed',
      description: `Switched to ${newTheme} mode`,
    });
  };

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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Handle AI chat with Puter.js
      if (newMessage.trim().toLowerCase().startsWith('/ai')) {
        setIsBotTyping(true);
        try {
          const response = await fetch('https://api.puter.com/v2/openai/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                {
                  role: 'system',
                  content: 'You are a helpful assistant in a chat application. Be concise and friendly.'
                },
                { role: 'user', content: newMessage.slice(3).trim() }
              ],
              model: 'gpt-3.5-turbo',
              temperature: 0.7,
              max_tokens: 500
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to get AI response');
          }

          const data = await response.json();
          const botMessage: Message = {
            id: crypto.randomUUID(),
            text: data.choices[0].message.content,
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-4 glass rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-medium">AI Assistant Available</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleThemeChange}
          className="transition-colors"
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
        
        <Button type="submit" size="icon" disabled={!newMessage.trim() && !selectedFile}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
