
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  LogOut, 
  Monitor, 
  Music2, 
  Film, 
  Gamepad2, 
  Trophy,
  HelpCircle,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface UserDetails {
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const chatRooms: ChatRoom[] = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'Discuss the latest tech trends and innovations',
    icon: <Monitor className="h-6 w-6" />
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Chat about your favorite sports and teams',
    icon: <Trophy className="h-6 w-6" />
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Share and discuss your favorite music',
    icon: <Music2 className="h-6 w-6" />
  },
  {
    id: 'movies',
    name: 'Movies',
    description: 'Talk about the latest films and classics',
    icon: <Film className="h-6 w-6" />
  },
  {
    id: 'games',
    name: 'Games',
    description: 'Connect with fellow gamers',
    icon: <Gamepad2 className="h-6 w-6" />
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const joinChatRoom = (roomId: string) => {
    toast({
      title: "Joining chat room",
      description: `Connecting to ${roomId} room...`
    });
    navigate(`/chat/${roomId}`);
  };

  const goToSupport = () => {
    toast({
      title: "Support",
      description: "Support feature coming soon!"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Real-Time Chat</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>
              Choose a chat room to start conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Chat Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {chatRooms.map((room) => (
            <Card 
              key={room.id}
              className="transition-all hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {room.icon}
                  </div>
                  <CardTitle className="text-xl">{room.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{room.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => joinChatRoom(room.id)}
                >
                  Join Room
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center">
          <Button
            variant="ghost"
            onClick={goToSupport}
            className="text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Need help?
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
