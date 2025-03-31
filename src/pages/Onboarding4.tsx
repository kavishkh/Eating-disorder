
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";

interface Goal {
  id: string;
  title: string;
  description: string;
}

const generateGoals = (concerns: string[]): Goal[] => {
  // This would ideally be connected to an AI API
  // For now, we'll generate goals based on predefined mappings
  const goalMappings: Record<string, Goal[]> = {
    body_image: [
      {
        id: "body_image_1",
        title: "Positive self-talk practice",
        description: "Practice positive affirmations about your body daily"
      },
      {
        id: "body_image_2",
        title: "Media literacy",
        description: "Critically analyze media messages about body image"
      }
    ],
    restricting: [
      {
        id: "restricting_1", 
        title: "Regular eating pattern",
        description: "Establish a consistent eating schedule with 3 meals and 2-3 snacks"
      },
      {
        id: "restricting_2",
        title: "Fear food exposure",
        description: "Gradually incorporate challenging foods with support"
      }
    ],
    binge: [
      {
        id: "binge_1",
        title: "Hunger awareness training",
        description: "Practice recognizing and responding to hunger/fullness cues"
      },
      {
        id: "binge_2",
        title: "Emotional regulation",
        description: "Develop strategies to cope with emotions without using food"
      }
    ],
    purging: [
      {
        id: "purging_1",
        title: "Delay response technique",
        description: "Practice delaying purging behaviors using distraction techniques"
      },
      {
        id: "purging_2",
        title: "Medical support",
        description: "Connect with healthcare provider for physical monitoring"
      }
    ],
    nutrition: [
      {
        id: "nutrition_1",
        title: "Balanced nutrition",
        description: "Learn about essential nutrients and balanced eating"
      },
      {
        id: "nutrition_2",
        title: "Flexible eating approach",
        description: "Work toward including all food groups without rigid rules"
      }
    ],
    anxiety: [
      {
        id: "anxiety_1",
        title: "Food exposure hierarchy",
        description: "Create and work through a hierarchy of anxiety-producing foods"
      },
      {
        id: "anxiety_2",
        title: "Mindfulness practices",
        description: "Learn mindfulness techniques for eating and food-related anxiety"
      }
    ],
    social: [
      {
        id: "social_1",
        title: "Social eating practice",
        description: "Gradually build comfort with eating in social settings"
      },
      {
        id: "social_2",
        title: "Communication skills",
        description: "Develop scripts for difficult food-related conversations"
      }
    ],
    thoughts: [
      {
        id: "thoughts_1",
        title: "Thought challenging",
        description: "Learn to identify and challenge disordered eating thoughts"
      },
      {
        id: "thoughts_2",
        title: "Journaling practice",
        description: "Track food-related thoughts and associated emotions"
      }
    ],
    control: [
      {
        id: "control_1",
        title: "Flexibility training",
        description: "Practice small exercises in flexibility around food and eating"
      },
      {
        id: "control_2",
        title: "Intuitive eating principles",
        description: "Learn about intuitive eating and body autonomy"
      }
    ]
  };

  let selectedGoals: Goal[] = [];
  
  concerns.forEach(concern => {
    if (goalMappings[concern]) {
      // Add all goals for this concern
      selectedGoals = [...selectedGoals, ...goalMappings[concern]];
    }
  });
  
  // Limit to 5 goals maximum
  return selectedGoals.slice(0, 5);
};

const Onboarding4 = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Generate goals based on user concerns
    const concernsString = localStorage.getItem("user_concerns");
    if (concernsString) {
      const concerns = JSON.parse(concernsString);
      
      // Simulate AI processing delay
      setTimeout(() => {
        const generatedGoals = generateGoals(concerns);
        setGoals(generatedGoals);
        setIsLoading(false);
        
        // Store goals in localStorage
        localStorage.setItem("user_goals", JSON.stringify(generatedGoals));
      }, 2000);
    } else {
      navigate("/onboarding/3");
    }
  }, [navigate]);
  
  const handleRegenerateGoals = () => {
    setIsGenerating(true);
    
    // Simulate API call to regenerate goals
    setTimeout(() => {
      const concernsString = localStorage.getItem("user_concerns");
      if (concernsString) {
        const concerns = JSON.parse(concernsString);
        const regeneratedGoals = generateGoals(concerns);
        setGoals(regeneratedGoals);
        
        // Store new goals in localStorage
        localStorage.setItem("user_goals", JSON.stringify(regeneratedGoals));
      }
      setIsGenerating(false);
    }, 1500);
  };
  
  const handleComplete = () => {
    navigate("/dashboard");
  };
  
  return (
    <OnboardingLayout step={4} totalSteps={4}>
      <h1 className="text-2xl font-bold mb-6 text-center">
        Your Personalized Recovery Goals
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Based on your concerns, we've created these goals to support your recovery journey.
      </p>
      
      {isLoading ? (
        <div className="space-y-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
          <p className="text-sm text-center mt-4">Generating your personalized goals...</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {goals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-1">{goal.title}</h3>
              <p className="text-sm text-gray-600">{goal.description}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex flex-col space-y-3">
        <Button 
          onClick={handleRegenerateGoals} 
          variant="outline" 
          disabled={isLoading || isGenerating}
        >
          {isGenerating ? "Regenerating..." : "Regenerate Goals"}
        </Button>
        
        <Button 
          onClick={handleComplete} 
          disabled={isLoading}
        >
          Complete & Go to Dashboard
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding4;
