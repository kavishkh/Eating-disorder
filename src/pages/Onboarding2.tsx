
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const Onboarding2 = () => {
  const [gender, setGender] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = () => {
    if (!gender) return;
    
    setIsLoading(true);
    
    // Store gender in localStorage
    localStorage.setItem("user_gender", gender);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/onboarding/3");
    }, 800);
  };
  
  return (
    <OnboardingLayout step={2} totalSteps={4}>
      <h1 className="text-2xl font-bold mb-6 text-center">
        How would you like us to address you?
      </h1>
      <p className="text-gray-600 text-center mb-8">
        This helps us personalize your experience and provide more relevant guidance.
      </p>
      
      <RadioGroup
        value={gender || ""}
        onValueChange={setGender}
        className="grid grid-cols-1 gap-4 mb-8"
      >
        {["Male", "Female", "Non-binary", "Prefer not to say"].map((option) => (
          <div key={option} className="relative">
            <RadioGroupItem
              value={option}
              id={option}
              className="peer absolute opacity-0"
            />
            <Label
              htmlFor={option}
              className={cn(
                "flex cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-gray-300 peer-focus-visible:ring-2 peer-focus-visible:ring-black transition-all",
                gender === option && "border-black bg-gray-50"
              )}
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/onboarding/1")}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={!gender || isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding2;
