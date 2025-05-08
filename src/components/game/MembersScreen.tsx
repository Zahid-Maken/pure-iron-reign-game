
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLocalGangMembers, getLocalUser, saveLocalGangMembers } from '@/lib/asyncStorage';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface GangMember {
  id: string;
  name: string;
  loyalty: number;
  skill: number;
  speciality: string;
  status: 'available' | 'mission' | 'injured';
  cost: number;
  background: string;
}

const defaultMembers: GangMember[] = [
  {
    id: 'min-ho',
    name: 'Min-ho',
    loyalty: 70,
    skill: 65,
    speciality: 'Street Dealer',
    status: 'available',
    cost: 1000,
    background: 'Former pharmacy student, addicted to his own product. Desperate for money and belonging.'
  },
  {
    id: 'ji-woo',
    name: 'Ji-woo',
    loyalty: 60,
    skill: 80,
    speciality: 'Lookout',
    status: 'available',
    cost: 1500,
    background: 'Teenage runaway with sharp eyes. Knows every corner and blind spot in the district.'
  },
  {
    id: 'tae-hwan',
    name: 'Tae-hwan',
    loyalty: 90,
    skill: 50,
    speciality: 'Enforcer',
    status: 'available',
    cost: 2000,
    background: 'Former boxer with a gambling debt and anger issues. Loyal to whoever pays him.'
  }
];

const MembersScreen = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [recruitsAvailable, setRecruitsAvailable] = useState<GangMember[]>(defaultMembers);
  const [myMembers, setMyMembers] = useState<GangMember[]>([]);
  const [playerMoney, setPlayerMoney] = useState(3000);
  const [selectedMember, setSelectedMember] = useState<GangMember | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getLocalUser();
      if (!userData) {
        navigate('/login');
        return;
      }
      setUserId(userData.id);
      
      // Load existing gang members
      const members = await getLocalGangMembers(userData.id);
      if (members) {
        setMyMembers(members);
      }
    };
    
    loadUser();
  }, [navigate]);

  const recruitMember = async (member: GangMember) => {
    if (playerMoney < member.cost) {
      alert("Not enough money to recruit!");
      return;
    }
    
    // Update player money
    setPlayerMoney(playerMoney - member.cost);
    
    // Add to my members
    const updatedMembers = [...myMembers, member];
    setMyMembers(updatedMembers);
    
    // Remove from recruits
    setRecruitsAvailable(recruitsAvailable.filter(r => r.id !== member.id));
    
    // Save to local storage
    if (userId) {
      await saveLocalGangMembers(userId, updatedMembers);
    }
  };

  const openMemberDetails = (member: GangMember) => {
    setSelectedMember(member);
  };

  const closeMemberDetails = () => {
    setSelectedMember(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-500';
      case 'mission':
        return 'bg-blue-500/20 text-blue-500';
      case 'injured':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (selectedMember) {
    return (
      <div className="game-container">
        <Card className="border-border">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-primary">{selectedMember.name}</CardTitle>
              <Badge className={getStatusColor(selectedMember.status)}>
                {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
              </Badge>
            </div>
            <CardDescription>{selectedMember.speciality}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded-md mb-4 flex items-center justify-center">
              <p className="text-accent opacity-50">MEMBER PORTRAIT</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Background</h3>
              <p className="text-muted-foreground">{selectedMember.background}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Loyalty</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${selectedMember.loyalty}%` }} 
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Skill</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${selectedMember.skill}%` }} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              onClick={closeMemberDetails}
              variant="outline"
            >
              Back
            </Button>
            
            {myMembers.some(m => m.id === selectedMember.id) ? (
              <Button className="game-btn" disabled>
                Already Recruited
              </Button>
            ) : (
              <Button 
                onClick={() => recruitMember(selectedMember)}
                disabled={playerMoney < selectedMember.cost}
                className={playerMoney < selectedMember.cost ? "game-btn-disabled" : "game-btn"}
              >
                Recruit (₩{selectedMember.cost})
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
        <h1 className="game-heading mb-2">Gang Members</h1>
        <p className="text-muted-foreground">Available Funds: ₩{playerMoney.toLocaleString()}</p>
      </div>
      
      {myMembers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Your Members</h2>
          
          <div className="space-y-4">
            {myMembers.map((member) => (
              <Card key={member.id} className="member-card" onClick={() => openMemberDetails(member)}>
                <div className="h-12 w-12 bg-muted rounded-full mr-4 flex items-center justify-center">
                  <span>{member.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.speciality}</p>
                </div>
                <Badge className={getStatusColor(member.status)}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-bold mb-4">Recruits Available</h2>
        
        <div className="space-y-4">
          {recruitsAvailable
            .filter(recruit => !myMembers.some(member => member.id === recruit.id))
            .map((recruit) => (
              <Card key={recruit.id} className="member-card" onClick={() => openMemberDetails(recruit)}>
                <div className="h-12 w-12 bg-muted rounded-full mr-4 flex items-center justify-center">
                  <span>{recruit.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{recruit.name}</h3>
                  <p className="text-sm text-muted-foreground">{recruit.speciality}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₩{recruit.cost}</p>
                </div>
              </Card>
            ))}
            
            {recruitsAvailable.filter(r => !myMembers.some(m => m.id === r.id)).length === 0 && (
              <p className="text-center py-8 text-muted-foreground">No more recruits available at this time.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default MembersScreen;
