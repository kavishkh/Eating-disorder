
export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  category: string;
  completed: boolean;
  thumbnail: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  icon: string;
}

export interface UserGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  createdAt: string;
}

export interface UserMood {
  mood: string;
  timestamp: string;
}

export interface UserActivity {
  id: string;
  type: 'chat' | 'learning' | 'visualization';
  title: string;
  description: string;
  timestamp: Date;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}
