
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '@/lib/asyncStorage';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      // Check if user is already logged in
      const loggedIn = await isLoggedIn();
      
      if (loggedIn) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    };
    
    checkLoginStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Korean Gangster: Pure Iron</h1>
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
