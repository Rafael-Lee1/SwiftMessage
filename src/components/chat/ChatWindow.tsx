
import React, { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import ContactSidebar from './ContactSidebar';
import AgendaSidebar from './AgendaSidebar';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useMobile } from '@/hooks/use-mobile';

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
  const { isMobile, isTablet } = useMobile();
  const [showContacts, setShowContacts] = React.useState(false);
  const [showAgenda, setShowAgenda] = React.useState(false);

  // Close sidebars when changing from mobile to desktop
  useEffect(() => {
    if (!isMobile && !isTablet) {
      setShowContacts(false);
      setShowAgenda(false);
    }
  }, [isMobile, isTablet]);

  return (
    <div className={`bg-gray-100 dark:bg-gray-900 h-[calc(100vh-56px)] md:h-screen relative`}>
      {/* Mobile Sidebar Toggles */}
      {(isMobile || isTablet) && (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
          <Button
            variant="default"
            size="icon"
            className="rounded-full shadow-md"
            onClick={() => {
              setShowContacts(!showContacts);
              if (showAgenda) setShowAgenda(false);
            }}
          >
            {showContacts ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Layout Grid */}
      <div className={`grid ${!isMobile && !isTablet ? 'grid-cols-[250px_1fr_300px]' : 'grid-cols-1'} h-full`}>
        {/* Contact Sidebar */}
        <div 
          className={`
            ${!isMobile && !isTablet ? 'block' : showContacts ? 'fixed inset-0 z-40 block animate-in fade-in' : 'hidden'} 
            ${showContacts ? 'w-[250px]' : ''}
          `}
        >
          <ContactSidebar />
        </div>

        {/* Main Chat Area */}
        <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <ChatProvider>
            <ChatContent />
          </ChatProvider>
        </div>

        {/* Agenda Sidebar - Hidden on Mobile */}
        <div className={`${!isMobile && !isTablet ? 'block' : 'hidden'}`}>
          <AgendaSidebar />
        </div>
      </div>

      {/* Mobile Overlay */}
      {(isMobile || isTablet) && showContacts && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowContacts(false)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
