
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
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
}
