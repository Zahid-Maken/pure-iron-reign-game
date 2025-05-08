import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase";

export const supabase = supabaseClient;

export async function signInWithGoogle() {
  console.log("Initiating Google sign-in...");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/intro`,
    }
  });
  
  console.log("Google sign-in result:", { data, error });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Save user progress
export async function saveUserProgress(userId: string, progress: any) {
  // First try to save to Supabase if online
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({ user_id: userId, ...progress }, { onConflict: 'user_id' })
      .select();
    
    if (!error) {
      console.log('Progress saved to Supabase');
      return { data, error: null };
    } else {
      console.error('Error saving to Supabase:', error);
      // Fallback to local storage
      await import('@/lib/asyncStorage').then(({ saveLocalUserProgress }) => {
        saveLocalUserProgress(userId, progress);
      });
      return { data: null, error };
    }
  } catch (e) {
    console.log('Could not save to Supabase, saving locally only');
    
    // Always save locally as backup
    await import('@/lib/asyncStorage').then(({ saveLocalUserProgress }) => {
      saveLocalUserProgress(userId, progress);
    });
    
    return { data: null, error: e };
  }
}

// Get user progress (tries Supabase first, falls back to local)
export async function getUserProgress(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (data && !error) {
      return { data, error: null };
    } else {
      console.error('Error fetching from Supabase:', error);
      // Fallback to local storage
      const localData = await import('@/lib/asyncStorage').then(({ getLocalUserProgress }) => {
        return getLocalUserProgress(userId);
      });
      
      return { data: localData, error: null };
    }
  } catch (e) {
    console.log('Could not fetch from Supabase, using local data');
    
    // Fallback to local storage
    const localData = await import('@/lib/asyncStorage').then(({ getLocalUserProgress }) => {
      return getLocalUserProgress(userId);
    });
    
    return { data: localData, error: e };
  }
}

// Similar pattern for other data functions
export async function saveGangMembers(userId: string, members: any[]) {
  try {
    // Try Supabase first
    await supabase
      .from('gang_members')
      .delete()
      .eq('user_id', userId);
    
    const membersWithUserId = members.map(member => ({ ...member, user_id: userId }));
    const { data, error } = await supabase
      .from('gang_members')
      .insert(membersWithUserId)
      .select();
    
    if (!error) {
      console.log('Gang members saved to Supabase');
      return { data, error: null };
    } else {
      console.error('Error saving to Supabase:', error);
      // Fallback to local storage
      await import('@/lib/asyncStorage').then(({ saveLocalGangMembers }) => {
        saveLocalGangMembers(userId, members);
      });
      return { data: null, error };
    }
  } catch (e) {
    console.log('Could not save to Supabase, saving locally only');
    
    // Always save locally as backup
    await import('@/lib/asyncStorage').then(({ saveLocalGangMembers }) => {
      saveLocalGangMembers(userId, members);
    });
    
    return { data: null, error: e };
  }
}

export async function getGangMembers(userId: string) {
  try {
    const { data, error } = await supabase
      .from('gang_members')
      .select('*')
      .eq('user_id', userId);
    
    if (data && !error) {
      return { data, error: null };
    } else {
      console.error('Error fetching from Supabase:', error);
      // Fallback to local storage
      const localData = await import('@/lib/asyncStorage').then(({ getLocalGangMembers }) => {
        return getLocalGangMembers(userId);
      });
      
      return { data: localData, error: null };
    }
  } catch (e) {
    console.log('Could not fetch from Supabase, using local data');
    
    // Fallback to local storage
    const localData = await import('@/lib/asyncStorage').then(({ getLocalGangMembers }) => {
      return getLocalGangMembers(userId);
    });
    
    return { data: localData, error: e };
  }
}

export async function saveMissionHistory(userId: string, mission: any) {
  try {
    const { data, error } = await supabase
      .from('mission_history')
      .insert({ ...mission, user_id: userId })
      .select();
    
    if (!error) {
      console.log('Mission history saved to Supabase');
      return { data, error: null };
    } else {
      console.error('Error saving to Supabase:', error);
      // Fallback to local storage
      await import('@/lib/asyncStorage').then(({ getLocalMissionHistory, saveLocalMissionHistory }) => {
        getLocalMissionHistory(userId).then(existingMissions => {
          const updatedMissions = [...(existingMissions || []), mission];
          saveLocalMissionHistory(userId, updatedMissions);
        });
      });
      return { data: null, error };
    }
  } catch (e) {
    console.log('Could not save to Supabase, saving locally only');
    
    // Always save locally
    await import('@/lib/asyncStorage').then(({ getLocalMissionHistory, saveLocalMissionHistory }) => {
      getLocalMissionHistory(userId).then(existingMissions => {
        const updatedMissions = [...(existingMissions || []), mission];
        saveLocalMissionHistory(userId, updatedMissions);
      });
    });
    
    return { data: null, error: e };
  }
}

export async function getMissionHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('mission_history')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    
    if (data && !error) {
      return { data, error: null };
    } else {
      console.error('Error fetching from Supabase:', error);
      // Fallback to local storage
      const localData = await import('@/lib/asyncStorage').then(({ getLocalMissionHistory }) => {
        return getLocalMissionHistory(userId);
      });
      
      return { data: localData || [], error: null };
    }
  } catch (e) {
    console.log('Could not fetch from Supabase, using local data');
    
    // Fallback to local storage
    const localData = await import('@/lib/asyncStorage').then(({ getLocalMissionHistory }) => {
      return getLocalMissionHistory(userId);
    });
    
    return { data: localData || [], error: e };
  }
}
