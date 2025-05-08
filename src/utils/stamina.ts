
import { asyncStorage } from '@/lib/asyncStorage';

const STAMINA_MAX = 100;
const STAMINA_REGEN_MINUTES = 5; // Minutes per stamina point

// Get current stamina
export async function getStamina(userId: string): Promise<number> {
  try {
    const staminaData = await asyncStorage.getItem(`stamina_${userId}`);
    
    if (!staminaData) {
      // If no stamina data exists, initialize with max stamina
      await setStamina(userId, STAMINA_MAX);
      return STAMINA_MAX;
    }
    
    const { stamina, lastUpdate } = staminaData;
    const currentTime = new Date().getTime();
    const elapsedMinutes = Math.floor((currentTime - lastUpdate) / (1000 * 60));
    
    // Calculate regenerated stamina
    let newStamina = stamina + Math.floor(elapsedMinutes / STAMINA_REGEN_MINUTES);
    newStamina = Math.min(newStamina, STAMINA_MAX); // Cap at max stamina
    
    // Update stamina if it regenerated
    if (newStamina > stamina) {
      await setStamina(userId, newStamina);
    }
    
    return newStamina;
  } catch (error) {
    console.error('Error getting stamina:', error);
    return STAMINA_MAX; // Fallback to max stamina
  }
}

// Set stamina to a specific value
export async function setStamina(userId: string, amount: number): Promise<boolean> {
  try {
    const staminaData = {
      stamina: Math.max(0, Math.min(amount, STAMINA_MAX)), // Ensure between 0 and max
      lastUpdate: new Date().getTime()
    };
    
    return await asyncStorage.setItem(`stamina_${userId}`, staminaData);
  } catch (error) {
    console.error('Error setting stamina:', error);
    return false;
  }
}

// Use stamina for a mission
export async function useStamina(userId: string, amount: number): Promise<boolean> {
  try {
    const currentStamina = await getStamina(userId);
    
    // Check if user has enough stamina
    if (currentStamina < amount) {
      return false;
    }
    
    // Deduct stamina
    await setStamina(userId, currentStamina - amount);
    return true;
  } catch (error) {
    console.error('Error using stamina:', error);
    return false;
  }
}

// Get time until next stamina point
export async function getTimeUntilNextStamina(userId: string): Promise<number> {
  try {
    const staminaData = await asyncStorage.getItem(`stamina_${userId}`);
    
    if (!staminaData || staminaData.stamina >= STAMINA_MAX) {
      return 0; // Already at max stamina
    }
    
    const currentTime = new Date().getTime();
    const { lastUpdate } = staminaData;
    
    const elapsedMinutesSinceLastUpdate = (currentTime - lastUpdate) / (1000 * 60);
    const minutesInCurrentCycle = elapsedMinutesSinceLastUpdate % STAMINA_REGEN_MINUTES;
    
    return STAMINA_REGEN_MINUTES - minutesInCurrentCycle;
  } catch (error) {
    console.error('Error calculating time until next stamina:', error);
    return 0;
  }
}

// Get max stamina
export function getMaxStamina(): number {
  return STAMINA_MAX;
}

// Get stamina regeneration rate in minutes
export function getStaminaRegenRate(): number {
  return STAMINA_REGEN_MINUTES;
}
