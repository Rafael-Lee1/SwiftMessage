
import { Message } from '@/types/chat';

export const saveMessagesToLocalStorage = (messages: Message[]): void => {
  try {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

export const loadMessagesFromLocalStorage = (): Message[] => {
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
};
