
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '@/lib/asyncStorage';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Check Supabase session first with timeout to avoid hanging
        const sessionPromise = supabase.auth.getSession();
        
        // Add a timeout to ensure we don't hang indefinitely
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Supabase session check timed out')), 5000);
        });
        
        try {
          const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
          
          if (session?.user) {
            console.log("Active session found, redirecting to home");
            navigate('/home');
            return;
          }
        } catch (error) {
          console.warn("Could not check Supabase session:", error);
          // Continue with local check
        }
        
        // Fall back to local check
        const loggedIn = await isLoggedIn();
        
        if (loggedIn) {
          console.log("User logged in locally, redirecting to home");
          navigate('/home');
        } else {
          console.log("No authenticated user found, redirecting to login");
          navigate('/login');
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoginStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Korean Gangster: Pure Iron</h1>
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xl text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <p className="text-xl text-muted-foreground">Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default Index;
