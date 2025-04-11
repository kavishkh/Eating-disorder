
// This is a mock implementation that would be replaced with actual AI API calls
// in a real application

import { AiGeneratedGoal } from '@/types';

// This simulates an AI response with predefined recovery-focused goal suggestions
export const createGoalFromAI = async (): Promise<AiGeneratedGoal> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const goalSuggestions = [
    {
      title: "Eat three balanced meals per day",
      description: "Focus on including protein, carbs, and fats in each meal. Track your progress in a non-judgmental way.",
      category: "Nutrition",
      difficulty: "beginner" as "beginner"
    },
    {
      title: "Practice mindful eating once daily",
      description: "Take 15 minutes to eat one meal without distractions. Focus on flavors, textures, and your body's hunger/fullness cues.",
      category: "Mindfulness",
      difficulty: "beginner" as "beginner"
    },
    {
      title: "Challenge one food rule each week",
      description: "Identify one food rule or restriction and work with your support team to gradually challenge it.",
      category: "Recovery",
      difficulty: "intermediate" as "intermediate"
    },
    {
      title: "Schedule regular meal times",
      description: "Establish a consistent eating schedule to help normalize eating patterns and reduce anxiety around mealtimes.",
      category: "Structure",
      difficulty: "beginner" as "beginner"
    },
    {
      title: "Engage in gentle movement 3x weekly",
      description: "Choose activities that feel good for your body rather than focusing on burning calories or changing your body.",
      category: "Movement",
      difficulty: "beginner" as "beginner"
    },
    {
      title: "Practice one positive body affirmation daily",
      description: "Focus on what your body can do rather than how it looks. Write these affirmations in a recovery journal.",
      category: "Self-compassion",
      difficulty: "beginner" as "beginner"
    },
    {
      title: "Attend a support group weekly",
      description: "Connect with others who understand what you're going through. Sharing experiences can reduce isolation.",
      category: "Support",
      difficulty: "intermediate" as "intermediate"
    },
    {
      title: "Identify and challenge negative thoughts daily",
      description: "Notice when critical thoughts arise and practice reframing them with self-compassion and evidence-based thinking.",
      category: "Cognitive",
      difficulty: "advanced" as "advanced"
    },
    {
      title: "Explore one new food each week",
      description: "Gradually expand your food variety by trying one new or previously avoided food in a safe environment.",
      category: "Nutrition",
      difficulty: "intermediate" as "intermediate"
    },
    {
      title: "Practice deep breathing for 5 minutes daily",
      description: "Use deep breathing techniques to manage anxiety around food, body image, or other triggers.",
      category: "Coping Skills",
      difficulty: "beginner" as "beginner"
    }
  ];

  // Return a random goal from the predefined list
  return goalSuggestions[Math.floor(Math.random() * goalSuggestions.length)];
};

// In a real application, this would analyze user input and goals
export const analyzeGoalProgress = async (goalTitle: string, progress: number): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (progress === 100) {
    return "Congratulations on completing this goal! This is a significant achievement. Consider creating a new goal that builds on this success.";
  } else if (progress >= 75) {
    return `You're making excellent progress on '${goalTitle}'. Keep going - you're almost there!`;
  } else if (progress >= 50) {
    return `You're halfway through your goal '${goalTitle}'. This is a great time to reflect on what's working and what challenges remain.`;
  } else if (progress >= 25) {
    return `You've started making progress on '${goalTitle}'. Remember that small steps lead to big changes over time.`;
  } else {
    return `You're at the beginning of your journey with '${goalTitle}'. Start small and celebrate each step forward.`;
  }
};

export const generateMultipleGoalSuggestions = async (count: number = 3): Promise<AiGeneratedGoal[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const allGoals = [
    {
      title: "Eat three balanced meals per day",
      description: "Focus on including protein, carbs, and fats in each meal. Track your progress in a non-judgmental way.",
      category: "Nutrition",
      difficulty: "beginner" as "beginner"
    },
    {
      title: "Practice mindful eating once daily",
      description: "Take 15 minutes to eat one meal without distractions. Focus on flavors, textures, and your body's hunger/fullness cues.",
      category: "Mindfulness",
      difficulty: "beginner" as "beginner"
    },
    {
      title: "Challenge one food rule each week",
      description: "Identify one food rule or restriction and work with your support team to gradually challenge it.",
      category: "Recovery",
      difficulty: "intermediate" as "intermediate"
    },
    {
      title: "Schedule regular meal times",
      description: "Establish a consistent eating schedule to help normalize eating patterns and reduce anxiety around mealtimes.",
      category: "Structure", 
      difficulty: "beginner" as "beginner"
    },
    {
      title: "Engage in gentle movement 3x weekly",
      description: "Choose activities that feel good for your body rather than focusing on burning calories or changing your body.",
      category: "Movement",
      difficulty: "beginner" as "beginner"
    },
    {
      title: "Practice one positive body affirmation daily",
      description: "Focus on what your body can do rather than how it looks. Write these affirmations in a recovery journal.",
      category: "Self-compassion",
      difficulty: "beginner" as "beginner"
    },
    {
      title: "Attend a support group weekly",
      description: "Connect with others who understand what you're going through. Sharing experiences can reduce isolation.",
      category: "Support",
      difficulty: "intermediate" as "intermediate"
    },
    {
      title: "Identify and challenge negative thoughts daily",
      description: "Notice when critical thoughts arise and practice reframing them with self-compassion and evidence-based thinking.",
      category: "Cognitive",
      difficulty: "advanced" as "advanced"
    },
    {
      title: "Explore one new food each week",
      description: "Gradually expand your food variety by trying one new or previously avoided food in a safe environment.",
      category: "Nutrition", 
      difficulty: "intermediate" as "intermediate"
    }
  ];
  
  // Shuffle array to get random selections
  const shuffled = [...allGoals].sort(() => 0.5 - Math.random());
  
  // Return requested number of goals
  return shuffled.slice(0, count);
};
