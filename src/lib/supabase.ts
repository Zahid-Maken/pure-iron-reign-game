
import { createClient } from '@supabase/supabase-js';

// Public anon key is safe to be in code
const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    }
  });
  
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
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({ user_id: userId, ...progress }, { onConflict: 'user_id' })
    .select();
  
  return { data, error };
}

// Get user progress
export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
}

// Save gang members
export async function saveGangMembers(userId: string, members: any[]) {
  // First delete existing members
  await supabase
    .from('gang_members')
    .delete()
    .eq('user_id', userId);
  
  // Then insert new members
  const membersWithUserId = members.map(member => ({ ...member, user_id: userId }));
  const { data, error } = await supabase
    .from('gang_members')
    .insert(membersWithUserId)
    .select();
  
  return { data, error };
}

// Get gang members
export async function getGangMembers(userId: string) {
  const { data, error } = await supabase
    .from('gang_members')
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
}

// Save mission history
export async function saveMissionHistory(userId: string, mission: any) {
  const { data, error } = await supabase
    .from('mission_history')
    .insert({ ...mission, user_id: userId })
    .select();
  
  return { data, error };
}

// Get mission history
export async function getMissionHistory(userId: string) {
  const { data, error } = await supabase
    .from('mission_history')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  
  return { data, error };
}
