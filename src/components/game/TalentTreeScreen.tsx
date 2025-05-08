
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLocalUser } from '@/lib/asyncStorage';
import { useNavigate } from 'react-router-dom';

interface Talent {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  category: 'business' | 'combat' | 'leadership';
  requires: string[];
}

const TalentTreeScreen = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [talentPoints, setTalentPoints] = useState(3);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [talents, setTalents] = useState<Talent[]>([
    {
      id: 'street_smarts',
      name: 'Street Smarts',
      description: 'Gain 20% more money from street-level missions.',
      cost: 1,
      unlocked: false,
      category: 'business',
      requires: []
    },
    {
      id: 'intimidation',
      name: 'Intimidation',
      description: 'Increase success rate of missions by 10%.',
      cost: 1,
      unlocked: false,
      category: 'leadership',
      requires: []
    },
    {
      id: 'martial_arts',
      name: 'Martial Arts',
      description: 'Increase combat effectiveness in physical confrontations.',
      cost: 1,
      unlocked: false,
      category: 'combat',
      requires: []
    },
    {
      id: 'dealer_network',
      name: 'Dealer Network',
      description: 'Unlock higher level drug dealing missions.',
      cost: 2,
      unlocked: false,
      category: 'business',
      requires: ['street_smarts']
    },
    {
      id: 'gang_loyalty',
      name: 'Gang Loyalty',
      description: 'Increase loyalty gain of all gang members by 15%.',
      cost: 2,
      unlocked: false,
      category: 'leadership',
      requires: ['intimidation']
    },
    {
      id: 'weapon_training',
      name: 'Weapon Training',
      description: 'Improve effectiveness in missions requiring firearms.',
      cost: 2,
      unlocked: false,
      category: 'combat',
      requires: ['martial_arts']
    }
  ]);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getLocalUser();
      if (!userData) {
        navigate('/login');
        return;
      }
      setUserId(userData.id);
      
      // Load talents from local storage (would be implemented in a real app)
    };
    
    loadUser();
  }, [navigate]);

  const openTalentDetails = (talent: Talent) => {
    setSelectedTalent(talent);
  };

  const closeTalentDetails = () => {
    setSelectedTalent(null);
  };

  const unlockTalent = (talent: Talent) => {
    if (talentPoints < talent.cost) {
      alert("Not enough talent points!");
      return;
    }
    
    // Check requirements
    const missingRequirements = talent.requires.filter(
      reqId => !talents.find(t => t.id === reqId)?.unlocked
    );
    
    if (missingRequirements.length > 0) {
      alert("You need to unlock required talents first!");
      return;
    }
    
    // Update talent points
    setTalentPoints(talentPoints - talent.cost);
    
    // Update talents
    setTalents(talents.map(t => 
      t.id === talent.id ? { ...t, unlocked: true } : t
    ));
    
    setSelectedTalent({ ...talent, unlocked: true });
  };
  
  const isAvailable = (talent: Talent) => {
    if (talent.unlocked) return false;
    
    return talent.requires.every(reqId => 
      talents.find(t => t.id === reqId)?.unlocked
    );
  };

  if (selectedTalent) {
    return (
      <div className="game-container">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-primary">{selectedTalent.name}</CardTitle>
            <CardDescription>
              {selectedTalent.category.charAt(0).toUpperCase() + selectedTalent.category.slice(1)} Talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{selectedTalent.description}</p>
            
            {selectedTalent.requires.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Requirements:</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {selectedTalent.requires.map(reqId => {
                    const req = talents.find(t => t.id === reqId);
                    return (
                      <li key={reqId} className={req?.unlocked ? 'line-through' : ''}>
                        {req?.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-sm font-medium">Cost:</h3>
              <p>{selectedTalent.cost} Talent Point{selectedTalent.cost > 1 ? 's' : ''}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              onClick={closeTalentDetails}
              variant="outline"
            >
              Back
            </Button>
            
            {selectedTalent.unlocked ? (
              <Button disabled className="game-btn-disabled">
                Unlocked
              </Button>
            ) : (
              <Button 
                onClick={() => unlockTalent(selectedTalent)}
                disabled={!isAvailable(selectedTalent) || talentPoints < selectedTalent.cost}
                className={!isAvailable(selectedTalent) || talentPoints < selectedTalent.cost ? "game-btn-disabled" : "game-btn"}
              >
                Unlock ({selectedTalent.cost} TP)
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
        <h1 className="game-heading mb-2">Talent Tree</h1>
        <p className="text-muted-foreground">Available Points: {talentPoints}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Business</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {talents.filter(t => t.category === 'business').map(talent => (
            <Card 
              key={talent.id} 
              className={`border cursor-pointer ${talent.unlocked ? 'bg-primary/10 border-primary/30' : isAvailable(talent) ? 'bg-card hover:border-primary/30' : 'bg-muted opacity-70'}`}
              onClick={() => openTalentDetails(talent)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{talent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{talent.description}</p>
              </CardContent>
              <CardFooter>
                {talent.unlocked ? (
                  <span className="text-xs text-primary">Unlocked</span>
                ) : (
                  <span className="text-xs">{talent.cost} Point{talent.cost > 1 ? 's' : ''}</span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Combat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {talents.filter(t => t.category === 'combat').map(talent => (
            <Card 
              key={talent.id} 
              className={`border cursor-pointer ${talent.unlocked ? 'bg-primary/10 border-primary/30' : isAvailable(talent) ? 'bg-card hover:border-primary/30' : 'bg-muted opacity-70'}`}
              onClick={() => openTalentDetails(talent)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{talent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{talent.description}</p>
              </CardContent>
              <CardFooter>
                {talent.unlocked ? (
                  <span className="text-xs text-primary">Unlocked</span>
                ) : (
                  <span className="text-xs">{talent.cost} Point{talent.cost > 1 ? 's' : ''}</span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {talents.filter(t => t.category === 'leadership').map(talent => (
            <Card 
              key={talent.id} 
              className={`border cursor-pointer ${talent.unlocked ? 'bg-primary/10 border-primary/30' : isAvailable(talent) ? 'bg-card hover:border-primary/30' : 'bg-muted opacity-70'}`}
              onClick={() => openTalentDetails(talent)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{talent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{talent.description}</p>
              </CardContent>
              <CardFooter>
                {talent.unlocked ? (
                  <span className="text-xs text-primary">Unlocked</span>
                ) : (
                  <span className="text-xs">{talent.cost} Point{talent.cost > 1 ? 's' : ''}</span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TalentTreeScreen;
