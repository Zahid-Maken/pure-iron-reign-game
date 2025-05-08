
import React, { useEffect, useState } from 'react';
import { signInWithGoogle, getCurrentUser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { saveLocalUser } from '@/lib/asyncStorage';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        await saveLocalUser(user);
        navigate('/intro');
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
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader>
          <CardTitle className="game-heading">Korean Gangster: Pure Iron</CardTitle>
          <CardDescription className="text-muted-foreground">
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
            className="w-full game-btn"
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen;
