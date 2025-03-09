
import React from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
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
    <>
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
    </>
  );
};

const ChatWindow = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-4 glass rounded-lg shadow-lg">
      <ChatProvider>
        <ChatContent />
      </ChatProvider>
    </div>
  );
};

export default ChatWindow;
