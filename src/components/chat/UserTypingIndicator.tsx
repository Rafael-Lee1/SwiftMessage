
import React from 'react';

const UserTypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground animate-pulse">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>Someone is typing...</span>
    </div>
  );
};

export default UserTypingIndicator;
