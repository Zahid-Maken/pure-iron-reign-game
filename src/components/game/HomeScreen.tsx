
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/supabase';
import { clearLocalUser, getLocalUser } from '@/lib/asyncStorage';
import { useNavigate } from 'react-router-dom';
import { getStamina, getMaxStamina, getTimeUntilNextStamina } from '@/utils/stamina';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [playerStats, setPlayerStats] = useState({
    level: 1,
    experience: 0,
    money: 1000,
    courage: 5,
    reputation: 0
  });
  const [stamina, setStamina] = useState(0);
  const [nextStaminaIn, setNextStaminaIn] = useState(0);
  const [loading, setLoading] = useState(true);
  const maxStamina = getMaxStamina();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await getLocalUser();
        if (!userData) {
          navigate('/login');
          return;
        }
        setUser(userData);
        
        // Load player stamina
        const currentStamina = await getStamina(userData.id);
        setStamina(currentStamina);
        
        // Start timer for stamina regeneration
        const interval = setInterval(async () => {
          const timeLeft = await getTimeUntilNextStamina(userData.id);
          setNextStaminaIn(Math.ceil(timeLeft));
          
          const updatedStamina = await getStamina(userData.id);
          setStamina(updatedStamina);
        }, 10000); // Update every 10 seconds
        
        setLoading(false);
        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error loading user data:", error);
        setLoading(false);
      }
    };
    
    loadUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      await clearLocalUser();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive"
      });
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) return 'Less than a minute';
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="game-container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Loading game data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="mb-6">
        <h1 className="game-heading mb-2">Home Base</h1>
        {user && (
          <p className="text-muted-foreground">
            Playing as {user.user_metadata?.name || user.email}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Player Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="font-bold">{playerStats.level}</span>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Experience:</span>
                  <span>{playerStats.experience} / 100</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${playerStats.experience}%` }} 
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <span>Money:</span>
                <span className="font-bold">₩{playerStats.money.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Courage:</span>
                <span className="font-bold">{playerStats.courage}</span>
              </div>
              <div className="flex justify-between">
                <span>Gang Reputation:</span>
                <span className="font-bold">{playerStats.reputation}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Stamina</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-1 flex justify-between">
              <span>Current Stamina:</span>
              <span>{stamina} / {maxStamina}</span>
            </div>
            <div className="progress-bar mb-4">
              <div 
                className="progress-fill" 
                style={{ width: `${(stamina / maxStamina) * 100}%` }} 
              />
            </div>
            {stamina < maxStamina && (
              <p className="text-sm text-muted-foreground">
                Next stamina point in: {formatTime(nextStaminaIn)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Current Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Find and confront your wife's killer</li>
            <li>Establish a steady income through street deals</li>
            <li>Recruit your first gang member</li>
          </ul>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          variant="outline"
          onClick={handleLogout}
          className="text-muted-foreground"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;
