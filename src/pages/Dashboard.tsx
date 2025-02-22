
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserDetails {
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const getUserDetails = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserDetails({
          email: user.email,
          user_metadata: user.user_metadata
        });
      }
    };
    getUserDetails();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const goToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>
              Here's your personal dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              {userDetails?.user_metadata?.avatar_url ? (
                <img 
                  src={userDetails.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="rounded-full w-16 h-16"
                />
              ) : (
                <User className="w-16 h-16 p-4 bg-muted rounded-full" />
              )}
              <div>
                <h3 className="font-medium">
                  {userDetails?.user_metadata?.full_name || userDetails?.email}
                </h3>
                <p className="text-sm text-muted-foreground">{userDetails?.email}</p>
              </div>
            </div>

            <div>
              <Button
                onClick={goToChat}
                className="w-full"
                size="lg"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Go to Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
