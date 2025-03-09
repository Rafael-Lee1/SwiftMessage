
import React from 'react';

interface UserTypingIndicatorProps {
  isUser?: boolean;
  isBot?: boolean;
}

const UserTypingIndicator: React.FC<UserTypingIndicatorProps> = ({ isUser, isBot }) => {
  let message = "Someone is typing...";
  
  if (isBot) {
    message = "AI is thinking...";
  } else if (isUser) {
    message = "You are typing...";
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground animate-pulse">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{message}</span>
    </div>
  );
};

export default UserTypingIndicator;
