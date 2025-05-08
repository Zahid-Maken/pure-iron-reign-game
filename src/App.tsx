
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/auth/LoginScreen";
import GameIntro from "./components/game/GameIntro";
import HomeScreen from "./components/game/HomeScreen";
import MissionsScreen from "./components/game/MissionsScreen";
import MembersScreen from "./components/game/MembersScreen";
import TalentTreeScreen from "./components/game/TalentTreeScreen";
import GameLayout from "./layouts/GameLayout";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { saveLocalUser } from "./lib/asyncStorage";

const queryClient = new QueryClient();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  
  useEffect(() => {
    // Set up auth state listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session?.user) {
          // Save user info locally for offline functionality
          await saveLocalUser(session.user);
        }
        
        setInitializing(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Save user info locally for offline functionality
        saveLocalUser(session.user).then(() => {
          setInitializing(false);
        });
      } else {
        setInitializing(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/intro" element={<GameIntro />} />
            
            {/* Game routes with layout */}
            <Route element={<GameLayout />}>
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/missions" element={<MissionsScreen />} />
              <Route path="/members" element={<MembersScreen />} />
              <Route path="/talents" element={<TalentTreeScreen />} />
            </Route>
            
            {/* Root route */}
            <Route path="/" element={<Index />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
