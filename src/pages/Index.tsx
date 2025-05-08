
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '@/lib/asyncStorage';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Check if user is already logged in
        const loggedIn = await isLoggedIn();
        
        if (loggedIn) {
          navigate('/home');
        } else {
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
