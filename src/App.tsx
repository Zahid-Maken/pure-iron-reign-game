
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

const queryClient = new QueryClient();

const App = () => (
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
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
