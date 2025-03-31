
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const concerns = [
  { id: "body_image", label: "Body image concerns" },
  { id: "restricting", label: "Restrictive eating behaviors" },
  { id: "binge", label: "Binge eating episodes" },
  { id: "purging", label: "Purging behaviors" },
  { id: "nutrition", label: "Nutritional concerns" },
  { id: "anxiety", label: "Food-related anxiety" },
  { id: "social", label: "Social eating difficulties" },
  { id: "thoughts", label: "Intrusive thoughts about food" },
  { id: "control", label: "Need for control over eating" },
];

const Onboarding3 = () => {
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleConcernToggle = (concernId: string) => {
    if (selectedConcerns.includes(concernId)) {
      setSelectedConcerns(
        selectedConcerns.filter((id) => id !== concernId)
      );
    } else {
      if (selectedConcerns.length >= 3) {
        toast({
          title: "Maximum selections reached",
          description: "Please select no more than 3 key concerns.",
        });
        return;
      }
      setSelectedConcerns([...selectedConcerns, concernId]);
    }
  };
  
  const handleSubmit = () => {
    if (selectedConcerns.length === 0) {
      toast({
        title: "Please select at least one concern",
        description: "This helps us create a personalized plan for you.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Store concerns in localStorage
    localStorage.setItem("user_concerns", JSON.stringify(selectedConcerns));
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/onboarding/4");
    }, 1000);
  };
  
  return (
    <OnboardingLayout step={3} totalSteps={4}>
      <h1 className="text-2xl font-bold mb-6 text-center">
        Select Your Key Concerns
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Choose up to 3 areas that you'd like to focus on during your recovery journey.
      </p>
      
      <div className="grid grid-cols-1 gap-3 mb-8">
        {concerns.map((concern) => (
          <div key={concern.id} className="flex items-center space-x-3">
            <Checkbox
              id={concern.id}
              checked={selectedConcerns.includes(concern.id)}
              onCheckedChange={() => handleConcernToggle(concern.id)}
              className={cn(
                "border-gray-300",
                selectedConcerns.includes(concern.id) && "border-black"
              )}
            />
            <Label
              htmlFor={concern.id}
              className="text-base font-normal cursor-pointer"
            >
              {concern.label}
            </Label>
          </div>
        ))}
      </div>
      
      <p className="text-sm text-gray-500 mb-6 text-center">
        Selected: {selectedConcerns.length}/3
      </p>
      
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/onboarding/2")}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={selectedConcerns.length === 0 || isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding3;
