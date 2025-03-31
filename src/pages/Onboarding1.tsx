
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/OnboardingLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Onboarding1 = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Please fill in all fields",
        description: "Both name and email are required to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Store user data in localStorage
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/onboarding/2");
    }, 1000);
  };
  
  return (
    <OnboardingLayout step={1} totalSteps={4}>
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Mindful Recovery</h1>
      <p className="text-gray-600 text-center mb-8">
        Let's start your recovery journey together. Please tell us a bit about yourself.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Your Name
          </label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 text-base" 
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </form>
    </OnboardingLayout>
  );
};

export default Onboarding1;
