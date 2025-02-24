
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session }}) => {
      if (session) {
        navigate('/chat/general');
      }
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/chat/general');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/chat/general`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Chat App</CardTitle>
          <CardDescription>
            Sign in to start chatting with AI assistance and real-time reactions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={handleSignIn} className="w-full">
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
