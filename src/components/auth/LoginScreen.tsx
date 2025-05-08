
import React, { useEffect, useState } from 'react';
import { signInWithGoogle, getCurrentUser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { saveLocalUser } from '@/lib/asyncStorage';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          await saveLocalUser(user);
          navigate('/intro');
          toast({
            title: "Welcome back!",
            description: `Signed in as ${user.email || 'user'}`,
          });
        }
      } catch (err) {
        console.error("Error checking user:", err);
      }
    };

    checkUser();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader>
          <CardTitle className="game-heading text-center">Korean Gangster: Pure Iron</CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            Sign in to begin your journey from mechanic to mob boss
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
            <p className="text-xl font-bold text-primary">PURE IRON</p>
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full game-btn flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in with Google</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen;
