
import ChatWindow from '@/components/chat/ChatWindow';
import { supabase } from '@/integrations/supabase/client';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const { isMobile } = useMobile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="bg-primary text-white px-2 sm:px-4 py-2 flex justify-between items-center dark:bg-gray-800 dark:border-b dark:border-gray-700 h-14">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-white dark:text-gray-200 mr-2">
            <Menu className="h-5 w-5" />
          </Button>
          {!isMobile && (
            <h1 className="text-lg font-medium hidden sm:block">Chat Bubble</h1>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" className="text-white dark:text-gray-200 p-1 sm:p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Button>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-medium text-white dark:text-gray-200 hidden sm:block">Vinícius Carvalho</span>
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
              <AvatarImage src="" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Index;
