
// A browser implementation of AsyncStorage for offline functionality

export const asyncStorage = {
  setItem: async (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving data to localStorage', error);
      return false;
    }
  },

  getItem: async (key: string) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading data from localStorage', error);
      return null;
    }
  },

  removeItem: async (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data from localStorage', error);
      return false;
    }
  },

  clear: async () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage', error);
      return false;
    }
  }
};

// Function to save user progress locally
export async function saveLocalUserProgress(userId: string, progress: any) {
  return asyncStorage.setItem(`progress_${userId}`, progress);
}

// Function to get user progress locally
export async function getLocalUserProgress(userId: string) {
  return asyncStorage.getItem(`progress_${userId}`);
}

// Function to save gang members locally
export async function saveLocalGangMembers(userId: string, members: any[]) {
  return asyncStorage.setItem(`members_${userId}`, members);
}

// Function to get gang members locally
export async function getLocalGangMembers(userId: string) {
  return asyncStorage.getItem(`members_${userId}`);
}

// Function to save mission history locally
export async function saveLocalMissionHistory(userId: string, missions: any[]) {
  return asyncStorage.setItem(`missions_${userId}`, missions);
}

// Function to get mission history locally
export async function getLocalMissionHistory(userId: string) {
  return asyncStorage.getItem(`missions_${userId}`);
}

// Function to check if user is logged in locally
export async function isLoggedIn() {
  const user = await asyncStorage.getItem('user');
  return !!user;
}

// Function to save user data locally
export async function saveLocalUser(user: any) {
  return asyncStorage.setItem('user', user);
}

// Function to get user data locally
export async function getLocalUser() {
  return asyncStorage.getItem('user');
}

// Function to clear user data locally (logout)
export async function clearLocalUser() {
  return asyncStorage.removeItem('user');
}
