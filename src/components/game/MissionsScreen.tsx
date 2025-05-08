
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { missions } from '@/data/missions';
import { getLocalUser } from '@/lib/asyncStorage';
import { useNavigate } from 'react-router-dom';
import { getStamina, useStamina } from '@/utils/stamina';

const MissionsScreen = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userStamina, setUserStamina] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [activeMission, setActiveMission] = useState<any>(null);
  const [missionProgress, setMissionProgress] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [missionResult, setMissionResult] = useState<'success' | 'failure' | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getLocalUser();
      if (!userData) {
        navigate('/login');
        return;
      }
      setUserId(userData.id);
      
      // Load user stamina
      const stamina = await getStamina(userData.id);
      setUserStamina(stamina);
    };
    
    loadUser();
  }, [navigate]);

  // Filter missions based on player's level
  const availableMissions = missions.filter(mission => mission.unlockLevel <= currentLevel);

  const startMission = async (mission: any) => {
    if (!userId) return;
    
    // Check if player has enough stamina
    if (userStamina < mission.staminaCost) {
      alert("Not enough stamina!");
      return;
    }
    
    // Use stamina
    const success = await useStamina(userId, mission.staminaCost);
    if (!success) {
      alert("Failed to use stamina!");
      return;
    }
    
    // Update UI with new stamina
    const newStamina = await getStamina(userId);
    setUserStamina(newStamina);
    
    // Start mission
    setActiveMission(mission);
    setMissionProgress(0);
    setStoryIndex(0);
    setMissionResult(null);
    
    // Simulate mission progress
    const interval = setInterval(() => {
      setMissionProgress(prev => {
        const newProgress = prev + (100 / mission.durationMinutes / 60);
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 1000); // Update every second
    
    // Complete mission after duration
    setTimeout(() => {
      clearInterval(interval);
      setMissionProgress(100);
      
      // Determine mission success based on success rate
      const isSuccess = Math.random() * 100 < mission.successRate;
      setMissionResult(isSuccess ? 'success' : 'failure');
      
      // TODO: Update player stats, money, exp based on mission result
    }, mission.durationMinutes * 1000); // Convert to milliseconds (speeded up for demo)
  };

  const continueMissionStory = () => {
    if (!activeMission) return;
    
    if (storyIndex < activeMission.story.length - 1) {
      setStoryIndex(storyIndex + 1);
    } else if (missionResult) {
      // End mission and return to mission list
      setActiveMission(null);
    }
  };

  const endMission = () => {
    setActiveMission(null);
    setMissionResult(null);
  };

  if (activeMission) {
    return (
      <div className="game-container">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-primary">{activeMission.name}</CardTitle>
            <CardDescription>{activeMission.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {missionProgress < 100 ? (
              <>
                <div className="mb-2 flex justify-between">
                  <span>Mission Progress:</span>
                  <span>{Math.floor(missionProgress)}%</span>
                </div>
                <div className="progress-bar mb-6">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${missionProgress}%`, transition: 'width 1s linear' }} 
                  />
                </div>
                <p className="game-text">{activeMission.story[storyIndex]}</p>
              </>
            ) : (
              <>
                <div className={`p-4 mb-4 rounded-md ${missionResult === 'success' ? 'bg-primary/20' : 'bg-destructive/20'}`}>
                  <h3 className="font-bold text-lg mb-2">
                    {missionResult === 'success' ? 'Mission Successful' : 'Mission Failed'}
                  </h3>
                  <p>
                    {missionResult === 'success' 
                      ? `You gained ₩${activeMission.moneyReward} and ${activeMission.expReward} XP.` 
                      : 'You failed the mission and gained nothing.'}
                  </p>
                </div>
                <p className="game-text">{activeMission.story[storyIndex]}</p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {missionProgress < 100 ? (
              <Button onClick={() => endMission()} variant="outline">Abort Mission</Button>
            ) : (
              <Button 
                onClick={continueMissionStory} 
                className="game-btn w-full"
              >
                {storyIndex < activeMission.story.length - 1 ? 'Continue' : 'Complete Mission'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="mb-6">
        <h1 className="game-heading mb-2">Available Missions</h1>
        <p className="text-muted-foreground">Current Stamina: {userStamina}</p>
      </div>
      
      <div className="space-y-4">
        {availableMissions.map((mission) => (
          <Card key={mission.id} className="mission-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{mission.name}</CardTitle>
                <div className="flex">
                  <span className="stat-pill">Risk: {mission.riskLevel}/5</span>
                  <span className="stat-pill">Time: {mission.durationMinutes}m</span>
                </div>
              </div>
              <CardDescription>{mission.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="text-muted-foreground">Cost:</span> {mission.staminaCost} Stamina</p>
                  {mission.courageCost > 0 && (
                    <p><span className="text-muted-foreground">Courage needed:</span> {mission.courageCost}</p>
                  )}
                </div>
                <div>
                  <p><span className="text-muted-foreground">Reward:</span> ₩{mission.moneyReward}</p>
                  <p><span className="text-muted-foreground">XP:</span> {mission.expReward}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                onClick={() => startMission(mission)}
                disabled={userStamina < mission.staminaCost}
                className={userStamina < mission.staminaCost ? "game-btn-disabled w-full" : "game-btn w-full"}
              >
                Start Mission
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MissionsScreen;
