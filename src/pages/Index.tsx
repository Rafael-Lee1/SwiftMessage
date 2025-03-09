
import { Button } from '@/components/ui/button';
import ChatWindow from '@/components/chat/ChatWindow';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 transition-colors duration-300">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        className="fixed top-4 right-4 z-10"
      >
        <LogOut className="h-4 w-4" />
      </Button>
      <ChatWindow />
    </div>
  );
};

export default Index;
