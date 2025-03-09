
import React from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import ContactSidebar from './ContactSidebar';
import AgendaSidebar from './AgendaSidebar';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';

const ChatContent = () => {
  const {
    messages,
    isTyping,
    isBotTyping,
    selectedMessageForReaction,
    setSelectedMessageForReaction,
    handleReaction,
    handleShareMessage,
    handleBookmarkMessage,
    handleSend,
    setIsTyping
  } = useChatContext();

  return (
    <div className="flex flex-col h-full">
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

const ChatWindow = () => {
  return (
    <div className="chat-app-layout bg-gray-100 dark:bg-gray-900">
      <ContactSidebar />
      <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <ChatProvider>
          <ChatContent />
        </ChatProvider>
      </div>
      <AgendaSidebar />
    </div>
  );
};

export default ChatWindow;
