
import { Goal, MoodRecord, UserProfile, ProgressRecord, WeeklyActivity } from "@/types";

// This simulates a database service that would connect to a real backend in production
class DatabaseService {
  private static instance: DatabaseService;
  private userId: string = "user-1"; // Default user ID for demo

  private constructor() {
    // Initialize the service
    this.initializeLocalStorage();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public getUserId(): string {
    return this.userId;
  }

  private initializeLocalStorage() {
    if (!localStorage.getItem("mindful_goals")) {
      localStorage.setItem("mindful_goals", JSON.stringify([]));
    }
    if (!localStorage.getItem("mindful_moods")) {
      localStorage.setItem("mindful_moods", JSON.stringify([]));
    }
    if (!localStorage.getItem("mindful_user")) {
      localStorage.setItem("mindful_user", JSON.stringify({
        id: this.userId,
        name: "Demo User",
        email: "demo@example.com",
      }));
    }
    if (!localStorage.getItem("mindful_progress")) {
      localStorage.setItem("mindful_progress", JSON.stringify([]));
    }
    if (!localStorage.getItem("mindful_weekly_activities")) {
      localStorage.setItem("mindful_weekly_activities", JSON.stringify([]));
    }
  }

  // --- Goals Management ---
  public async getGoals(): Promise<Goal[]> {
    const goalsData = localStorage.getItem("mindful_goals");
    if (!goalsData) return [];
    
    const goals: Goal[] = JSON.parse(goalsData);
    return goals.filter(goal => goal.userId === this.userId);
  }

  public async addGoal(goalData: Omit<Goal, 'id' | 'userId' | 'createdAt'>): Promise<Goal> {
    const goalsData = localStorage.getItem("mindful_goals");
    const goals: Goal[] = goalsData ? JSON.parse(goalsData) : [];
    
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      userId: this.userId,
      createdAt: new Date().toISOString(),
      ...goalData
    };
    
    goals.push(newGoal);
    localStorage.setItem("mindful_goals", JSON.stringify(goals));
    
    return newGoal;
  }

  public async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
    const goalsData = localStorage.getItem("mindful_goals");
    if (!goalsData) return null;
    
    const goals: Goal[] = JSON.parse(goalsData);
    const goalIndex = goals.findIndex(g => g.id === goalId && g.userId === this.userId);
    
    if (goalIndex === -1) return null;
    
    const updatedGoal = {...goals[goalIndex], ...updates};
    goals[goalIndex] = updatedGoal;
    
    localStorage.setItem("mindful_goals", JSON.stringify(goals));
    return updatedGoal;
  }

  public async deleteGoal(goalId: string): Promise<boolean> {
    const goalsData = localStorage.getItem("mindful_goals");
    if (!goalsData) return false;
    
    const goals: Goal[] = JSON.parse(goalsData);
    const filteredGoals = goals.filter(g => !(g.id === goalId && g.userId === this.userId));
    
    if (filteredGoals.length === goals.length) return false;
    
    localStorage.setItem("mindful_goals", JSON.stringify(filteredGoals));
    return true;
  }

  // --- Mood Tracking ---
  public async getMoods(): Promise<MoodRecord[]> {
    const moodsData = localStorage.getItem("mindful_moods");
    if (!moodsData) return [];
    
    const moods: MoodRecord[] = JSON.parse(moodsData);
    return moods.filter(mood => mood.userId === this.userId);
  }

  public async addMood(value: number, day: string): Promise<MoodRecord> {
    const moodsData = localStorage.getItem("mindful_moods");
    const moods: MoodRecord[] = moodsData ? JSON.parse(moodsData) : [];
    
    // Check if mood for this day already exists
    const existingMoodIndex = moods.findIndex(m => 
      m.userId === this.userId && m.day === day
    );
    
    const newMood: MoodRecord = {
      id: `mood-${Date.now()}`,
      userId: this.userId,
      value,
      day,
      createdAt: new Date().toISOString()
    };
    
    if (existingMoodIndex >= 0) {
      // Update existing mood
      moods[existingMoodIndex] = newMood;
    } else {
      // Add new mood
      moods.push(newMood);
    }
    
    localStorage.setItem("mindful_moods", JSON.stringify(moods));

    // Update weekly activity summary
    this.updateWeeklyActivity();
    
    return newMood;
  }

  public async getMoodForWeek(): Promise<{[day: string]: number}> {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result: {[day: string]: number} = {};
    
    const moods = await this.getMoods();
    
    // Initialize all days with 0
    days.forEach(day => {
      result[day] = 0;
    });
    
    // Fill in recorded moods
    moods.forEach(mood => {
      if (days.includes(mood.day)) {
        result[mood.day] = mood.value;
      }
    });
    
    return result;
  }
  
  // --- Progress Tracking ---
  public async getProgressRecords(): Promise<ProgressRecord[]> {
    const progressData = localStorage.getItem("mindful_progress");
    if (!progressData) return [];
    
    const records: ProgressRecord[] = JSON.parse(progressData);
    return records.filter(record => record.userId === this.userId);
  }
  
  public async addProgressRecord(category: string, value: number): Promise<ProgressRecord> {
    const progressData = localStorage.getItem("mindful_progress");
    const records: ProgressRecord[] = progressData ? JSON.parse(progressData) : [];
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if record for this category and day already exists
    const existingIndex = records.findIndex(r => 
      r.userId === this.userId && r.category === category && r.date === today
    );
    
    const newRecord: ProgressRecord = {
      id: `progress-${Date.now()}`,
      userId: this.userId,
      category,
      value,
      date: today,
      createdAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      // Update existing record
      records[existingIndex] = newRecord;
    } else {
      // Add new record
      records.push(newRecord);
    }
    
    localStorage.setItem("mindful_progress", JSON.stringify(records));
    
    // Update user's overall progress
    this.updateOverallProgress();
    
    // Update weekly activity
    this.updateWeeklyActivity();
    
    return newRecord;
  }
  
  public async getCategoryProgress(category: string): Promise<number> {
    const records = await this.getProgressRecords();
    const categoryRecords = records.filter(r => r.category === category);
    
    if (categoryRecords.length === 0) return 0;
    
    // Calculate average progress for this category
    const sum = categoryRecords.reduce((acc, record) => acc + record.value, 0);
    return Math.round(sum / categoryRecords.length);
  }
  
  public async getRecentProgressByCategory(): Promise<{[category: string]: number}> {
    const records = await this.getProgressRecords();
    const result: {[category: string]: number} = {};
    
    // Group by category and take the most recent value
    const categories = [...new Set(records.map(r => r.category))];
    
    categories.forEach(category => {
      const categoryRecords = records.filter(r => r.category === category);
      const latest = categoryRecords.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
      result[category] = latest?.value || 0;
    });
    
    return result;
  }
  
  private async updateOverallProgress(): Promise<void> {
    const categoryProgress = await this.getRecentProgressByCategory();
    const categories = Object.keys(categoryProgress);
    
    if (categories.length === 0) return;
    
    // Calculate overall progress as average of all categories
    const sum = Object.values(categoryProgress).reduce((acc, val) => acc + val, 0);
    const overallProgress = Math.round(sum / categories.length);
    
    // Update user profile
    const userData = localStorage.getItem("mindful_user");
    const user: UserProfile = userData ? JSON.parse(userData) : { id: this.userId };
    
    user.progress = overallProgress;
    user.updatedAt = new Date().toISOString();
    
    localStorage.setItem("mindful_user", JSON.stringify(user));
  }
  
  // --- Weekly Activity Summary ---
  public async getWeeklyActivity(): Promise<WeeklyActivity | null> {
    const activitiesData = localStorage.getItem("mindful_weekly_activities");
    if (!activitiesData) return null;
    
    const activities: WeeklyActivity[] = JSON.parse(activitiesData);
    
    // Get the start and end of the current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    endOfWeek.setHours(23, 59, 59, 999);
    
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];
    
    // Find activity for current week
    const currentActivity = activities.find(a => 
      a.userId === this.userId && a.weekStartDate === startDate && a.weekEndDate === endDate
    );
    
    return currentActivity || null;
  }
  
  private async updateWeeklyActivity(): Promise<void> {
    // Get moods
    const moods = await this.getMoods();
    
    // Get goals
    const goals = await this.getGoals();
    
    // Get progress records
    const progressRecords = await this.getProgressRecords();
    
    // Calculate date range for current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    endOfWeek.setHours(23, 59, 59, 999);
    
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];
    
    // Filter items for current week
    const weekMoods = moods.filter(m => {
      const date = new Date(m.createdAt);
      return date >= startOfWeek && date <= endOfWeek;
    });
    
    const weekProgress = progressRecords.filter(p => {
      const date = new Date(p.createdAt);
      return date >= startOfWeek && date <= endOfWeek;
    });
    
    // Calculate average mood
    const avgMood = weekMoods.length > 0
      ? weekMoods.reduce((acc, m) => acc + m.value, 0) / weekMoods.length
      : 0;
    
    // Calculate activities completed (number of progress records)
    const activitiesCompleted = weekProgress.length;
    
    // Calculate goals progress average
    const goalsAvg = goals.length > 0
      ? goals.reduce((acc, g) => acc + g.progress, 0) / goals.length
      : 0;
    
    // Create or update weekly activity
    const activitiesData = localStorage.getItem("mindful_weekly_activities");
    const activities: WeeklyActivity[] = activitiesData ? JSON.parse(activitiesData) : [];
    
    const existingIndex = activities.findIndex(a => 
      a.userId === this.userId && a.weekStartDate === startDate && a.weekEndDate === endDate
    );
    
    const weeklyActivity: WeeklyActivity = {
      userId: this.userId,
      weekStartDate: startDate,
      weekEndDate: endDate,
      activitiesCompleted,
      averageMood: Math.round(avgMood * 10) / 10, // Round to 1 decimal place
      goalsProgressAverage: Math.round(goalsAvg)
    };
    
    if (existingIndex >= 0) {
      activities[existingIndex] = weeklyActivity;
    } else {
      activities.push(weeklyActivity);
    }
    
    localStorage.setItem("mindful_weekly_activities", JSON.stringify(activities));
  }
  
  // --- User Profile ---
  public async getUserProfile(): Promise<UserProfile> {
    const userData = localStorage.getItem("mindful_user");
    if (!userData) return { id: this.userId };
    
    return JSON.parse(userData);
  }
  
  public async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const userData = localStorage.getItem("mindful_user");
    const user: UserProfile = userData ? JSON.parse(userData) : { id: this.userId };
    
    const updatedUser = {...user, ...updates, updatedAt: new Date().toISOString()};
    localStorage.setItem("mindful_user", JSON.stringify(updatedUser));
    
    return updatedUser;
  }
}

export const db = DatabaseService.getInstance();
