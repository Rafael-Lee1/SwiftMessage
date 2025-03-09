
import { Message } from '@/types/chat';
import { fetchGeminiResponse } from '@/utils/chat/geminiUtils';
import { fetchAIResponse } from '@/utils/chat/aiUtils';
import { fetchClaudeResponse } from '@/utils/chat/claudeUtils';
import type { ToastAPI } from '@/hooks/use-toast';

class MessageService {
  async sendGeminiMessage(
    messageText: string,
    setIsBotTyping: (value: boolean) => void,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    toast: ToastAPI
  ): Promise<void> {
    setIsBotTyping(true);
    try {
      console.log('Calling Gemini with:', messageText);
      const geminiResponse = await fetchGeminiResponse(messageText);
      
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: geminiResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Gemini chat error:', error);
      toast({
        title: 'Gemini Assistant Error',
        description: error.message || 'Could not get a response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBotTyping(false);
    }
  }

  async sendAIMessage(
    messageText: string,
    setIsBotTyping: (value: boolean) => void,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    toast: ToastAPI
  ): Promise<void> {
    setIsBotTyping(true);
    try {
      const aiResponse = await fetchAIResponse(messageText);
      
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
  }

  async sendClaudeMessage(
    messageText: string,
    setIsBotTyping: (value: boolean) => void,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    toast: ToastAPI
  ): Promise<void> {
    setIsBotTyping(true);
    try {
      const claudeResponse = await fetchClaudeResponse(messageText);
      
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
  }
}

export default new MessageService();
