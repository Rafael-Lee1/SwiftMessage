
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sun, Moon, Search, Phone, Video, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  isBotAvailable: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isBotAvailable }) => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    toast({
      title: 'Theme Changed',
      description: `Switched to ${newTheme} mode`,
    });
  };

  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="/lovable-uploads/551d19b2-4705-4bf3-86ff-0725079998cf.png" />
          <AvatarFallback>RS</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 dark:text-gray-100">Rafael Souza</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-600 text-xs font-normal border-0 dark:bg-blue-900 dark:text-blue-200">
              NEW
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <span className="contact-status-online"></span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <MoreVertical className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleThemeChange}
          className="transition-colors rounded-full ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
