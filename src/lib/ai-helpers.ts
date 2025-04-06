
// This is a mock implementation that would be replaced with actual AI API calls
// in a real application

export interface GeneratedGoal {
  title: string;
  description: string;
}

// This simulates an AI response with predefined recovery-focused goal suggestions
export const createGoalFromAI = async (): Promise<GeneratedGoal> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const goalSuggestions = [
    {
      title: "Eat three balanced meals per day",
      description: "Focus on including protein, carbs, and fats in each meal. Track your progress in a non-judgmental way."
    },
    {
      title: "Practice mindful eating once daily",
      description: "Take 15 minutes to eat one meal without distractions. Focus on flavors, textures, and your body's hunger/fullness cues."
    },
    {
      title: "Challenge one food rule each week",
      description: "Identify one food rule or restriction and work with your support team to gradually challenge it."
    },
    {
      title: "Schedule regular meal times",
      description: "Establish a consistent eating schedule to help normalize eating patterns and reduce anxiety around mealtimes."
    },
    {
      title: "Engage in gentle movement 3x weekly",
      description: "Choose activities that feel good for your body rather than focusing on burning calories or changing your body."
    },
    {
      title: "Practice one positive body affirmation daily",
      description: "Focus on what your body can do rather than how it looks. Write these affirmations in a recovery journal."
    }
  ];
  
  // Return a random goal from the predefined list
  return goalSuggestions[Math.floor(Math.random() * goalSuggestions.length)];
};
