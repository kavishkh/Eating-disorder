export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'website' | 'directory' | 'guide';
  imageUrl?: string;
  category?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
  category?: string;
  completed?: boolean;
  thumbnail?: string;
}

export interface UserProfile {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
  createdAt?: string;
  updatedAt?: string;
  progress?: number; // Overall progress percentage
}

// Add types for AI chat related features
export interface ChatMessage {
  id: string;
  userId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Add types for 3D model interactions
export interface Model3D {
  id: string;
  name: string;
  description?: string;
  modelUrl: string;
  thumbnailUrl?: string;
  category: string;
}

export interface AiGeneratedGoal {
  title: string;
  description: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Database types
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  progress: number;
  createdAt: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface MoodRecord {
  id: string;
  userId: string;
  value: number;
  day: string;
  createdAt: string;
}

// Progress tracking
export interface ProgressRecord {
  id: string;
  userId: string;
  category: string; // 'meditation', 'learning', 'exercises', etc.
  value: number; // 0-100 percentage
  date: string; // ISO date string
  createdAt: string;
}

// Weekly activity summary
export interface WeeklyActivity {
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  activitiesCompleted: number;
  averageMood: number;
  goalsProgressAverage: number;
}

// Add types for detailed progress tracking
export interface ProgressDetails {
  id: string;
  userId: string;
  category: string;
  value: number; 
  date: string;
  createdAt: string;
  description?: string;
  tags?: string[];
}

// Progress summary by category
export interface CategoryProgress {
  category: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  previousValue?: number;
  change?: number;
}
