import { MoodEntry, ProgressMetrics } from "@/types/types";
import { moodAPI, progressAPI } from "@/utils/api";

export const saveMoodEntry = async (moodEntry: Omit<MoodEntry, 'id'>): Promise<string> => {
  try {
    const savedEntry = await moodAPI.create(moodEntry);
    return savedEntry._id || savedEntry.id;
  } catch (error) {
    console.error("Error adding mood entry:", error);
    throw error;
  }
};

export const updateMoodEntry = async (id: string, moodEntry: Partial<MoodEntry>): Promise<void> => {
  try {
    await moodAPI.update(id, moodEntry);
  } catch (error) {
    console.error("Error updating mood entry:", error);
    throw error;
  }
};

export const deleteMoodEntry = async (id: string): Promise<void> => {
  try {
    await moodAPI.delete(id);
  } catch (error) {
    console.error("Error deleting mood entry:", error);
    throw error;
  }
};

export const getUserMoodEntries = async (userId: string): Promise<MoodEntry[]> => {
  try {
    const entries = await moodAPI.getAll();
    return entries.map((entry: any) => ({
      id: entry._id || entry.id,
      userId: entry.userId,
      date: entry.date,
      mood: entry.mood,
      note: entry.note,
      timestamp: entry.timestamp
    }));
  } catch (error) {
    console.error("Error getting mood entries:", error);
    throw error;
  }
};

// Get the last 7 days of mood entries for a user
export const getUserRecentMoodEntries = async (userId: string, days = 7): Promise<MoodEntry[]> => {
  try {
    const entries = await moodAPI.getRecent(days);
    return entries.map((entry: any) => ({
      id: entry._id || entry.id,
      userId: entry.userId,
      date: entry.date,
      mood: entry.mood,
      note: entry.note,
      timestamp: entry.timestamp
    }));
  } catch (error) {
    console.error("Error getting recent mood entries:", error);
    throw error;
  }
};

// Check if a user has recorded a mood today
export const hasRecordedMoodToday = async (userId: string): Promise<boolean> => {
  try {
    const result = await moodAPI.hasRecordedToday();
    return result.hasRecorded;
  } catch (error) {
    console.error("Error checking today's mood entry:", error);
    return false;
  }
};

// Update user's progress metrics
export const updateUserProgressMetrics = async (userId: string): Promise<void> => {
  try {
    await progressAPI.getMetrics();
  } catch (error) {
    console.error("Error updating user progress metrics:", error);
  }
};

// Fallback to local storage if user is not authenticated or offline
export const getLocalMoodEntries = (): MoodEntry[] => {
  try {
    const storedMoods = localStorage.getItem('moodHistory');
    if (storedMoods) {
      return JSON.parse(storedMoods);
    }
  } catch (error) {
    console.error("Failed to parse mood history from localStorage:", error);
  }
  return [];
};

export const saveLocalMoodEntry = (moodEntry: MoodEntry): void => {
  try {
    const storedMoods = localStorage.getItem('moodHistory');
    let allMoods: MoodEntry[] = [];

    if (storedMoods) {
      allMoods = JSON.parse(storedMoods);
      // Remove any entries for this user on the same date
      allMoods = allMoods.filter(entry =>
        !(entry.date === moodEntry.date && entry.userId === moodEntry.userId)
      );
    }

    // Add the new entry
    allMoods.push(moodEntry);
    localStorage.setItem('moodHistory', JSON.stringify(allMoods));
  } catch (error) {
    console.error("Error saving local mood entry:", error);
  }
};

// Synchronize local entries with backend
export const syncLocalEntriesWithFirebase = async (userId: string): Promise<void> => {
  try {
    const localEntries = getLocalMoodEntries().filter(entry => entry.userId === userId);

    if (localEntries.length === 0) return;

    // For each local entry, try to save it to the backend
    for (const entry of localEntries) {
      try {
        await saveMoodEntry({
          userId: entry.userId,
          date: entry.date,
          mood: entry.mood,
          note: entry.note
        });
      } catch (error) {
        console.error('Failed to sync mood entry:', error);
      }
    }

    // Clear local entries after successful sync
    localStorage.removeItem('moodHistory');

  } catch (error) {
    console.error("Error syncing local entries:", error);
  }
};
