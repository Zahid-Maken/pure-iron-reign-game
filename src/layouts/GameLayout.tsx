
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GameLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine active tab based on current path
  let activeTab = 'home';
  if (currentPath.includes('missions')) {
    activeTab = 'missions';
  } else if (currentPath.includes('members')) {
    activeTab = 'members';
  } else if (currentPath.includes('talents')) {
    activeTab = 'talents';
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border p-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-primary">PURE IRON</h1>
        </div>
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <footer className="border-t border-border mt-auto">
        <div className="max-w-3xl mx-auto p-4">
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="home" asChild>
                <Link to="/home" className={activeTab === 'home' ? 'font-bold' : ''}>Home</Link>
              </TabsTrigger>
              <TabsTrigger value="missions" asChild>
                <Link to="/missions" className={activeTab === 'missions' ? 'font-bold' : ''}>Missions</Link>
              </TabsTrigger>
              <TabsTrigger value="members" asChild>
                <Link to="/members" className={activeTab === 'members' ? 'font-bold' : ''}>Members</Link>
              </TabsTrigger>
              <TabsTrigger value="talents" asChild>
                <Link to="/talents" className={activeTab === 'talents' ? 'font-bold' : ''}>Talents</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </footer>
    </div>
  );
};

export default GameLayout;
