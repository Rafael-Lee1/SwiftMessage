
import ChatWindow from '@/components/chat/ChatWindow';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-primary text-white px-4 py-2 flex justify-between items-center dark:bg-gray-800 dark:border-b dark:border-gray-700">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-white dark:text-gray-200 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-white dark:text-gray-200 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white dark:text-gray-200">Vinícius Carvalho</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <ChatWindow />
    </div>
  );
};

export default Index;
