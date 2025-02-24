
import { Bot, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";

const ChatHeader = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('chat-theme', newTheme);
    
    toast({
      title: 'Theme Changed',
      description: `Switched to ${newTheme} mode`,
    });
  };

  return (
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
  );
};

export default ChatHeader;
