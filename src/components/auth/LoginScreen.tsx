
import React, { useEffect, useState } from 'react';
import { signInWithGoogle, getCurrentUser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { saveLocalUser } from '@/lib/asyncStorage';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check Supabase session first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await saveLocalUser(session.user);
          console.log("Session found, redirecting to intro");
          navigate('/intro');
          return;
        }
        
        // Fall back to checking local user
        const user = await getCurrentUser();
        if (user) {
          await saveLocalUser(user);
          console.log("User found locally, redirecting to intro");
          navigate('/intro');
        }
      } catch (err) {
        console.error("Error checking user:", err);
      }
    };

    checkUser();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await saveLocalUser(session.user);
          toast({
            title: "Login successful",
            description: `Welcome, ${session.user.email || 'user'}!`,
          });
          console.log("User signed in, redirecting to intro");
          navigate('/intro');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
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
        console.error("Google login error:", error);
      } else {
        console.log("Google login initiated");
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error("Unexpected error during login:", err);
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
