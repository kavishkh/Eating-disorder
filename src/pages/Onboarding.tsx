
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check } from "lucide-react";

const disorderTypes = [
  {
    id: "anorexia",
    name: "Anorexia Nervosa",
    description: "Characterized by weight loss, difficulties maintaining appropriate weight, and distorted body image.",
  },
  {
    id: "bulimia",
    name: "Bulimia Nervosa",
    description: "Characterized by cycles of bingeing and compensatory behaviors such as self-induced vomiting.",
  },
  {
    id: "binge-eating",
    name: "Binge Eating Disorder",
    description: "Characterized by recurring episodes of eating significantly more food in a short period of time than most people would eat under similar circumstances.",
  },
  {
    id: "arfid",
    name: "Avoidant/Restrictive Food Intake Disorder",
    description: "Characterized by highly selective eating habits, restricted intake, or both.",
  },
  {
    id: "osfed",
    name: "Other Specified Feeding or Eating Disorder",
    description: "Eating disorders that cause significant distress but don't meet the full criteria for other disorders.",
  },
  {
    id: "body-image",
    name: "Body Image Concerns",
    description: "Persistent concerns about appearance that cause distress but may not meet full criteria for an eating disorder.",
  },
  {
    id: "emotional-eating",
    name: "Emotional Eating",
    description: "Using food to cope with emotional states rather than physical hunger.",
  },
];

const Onboarding = () => {
  const [activeTab, setActiveTab] = useState("disorder-type");
  const [selectedDisorderType, setSelectedDisorderType] = useState("");
  const [goals, setGoals] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentUser, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (activeTab === "disorder-type" && selectedDisorderType) {
      setActiveTab("goal-setting");
    } else if (activeTab === "goal-setting" && goals) {
      setActiveTab("disclaimer");
    } else {
      toast({
        title: "Please complete this step",
        description: activeTab === "disorder-type" ? "Please select an option" : "Please enter at least one goal",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Update user profile with onboarding information
      await updateUserProfile({
        disorderType: selectedDisorderType,
        goals: goals.split("\n").filter(goal => goal.trim() !== ""),
        onboardingCompleted: true
      });
      
      toast({
        title: "Onboarding completed",
        description: "Your profile has been set up successfully",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <Card className="border-healing-100 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-healing-800">
              Welcome to Recovery Journey
            </CardTitle>
            <CardDescription className="text-center">
              Let's personalize your experience to better support your recovery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="disorder-type" disabled={activeTab !== "disorder-type"}>
                  Step 1: Identify
                </TabsTrigger>
                <TabsTrigger value="goal-setting" disabled={activeTab !== "goal-setting" && activeTab !== "disclaimer"}>
                  Step 2: Set Goals
                </TabsTrigger>
                <TabsTrigger value="disclaimer" disabled={activeTab !== "disclaimer"}>
                  Step 3: Acknowledge
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="disorder-type">
                <div className="space-y-4 mt-4">
                  <h3 className="text-lg font-medium">What are you seeking support with?</h3>
                  <p className="text-sm text-gray-600">
                    Select the option that best represents your primary concern. This helps us personalize your experience.
                  </p>
                  
                  <RadioGroup value={selectedDisorderType} onValueChange={setSelectedDisorderType}>
                    <div className="grid gap-4 md:grid-cols-2">
                      {disorderTypes.map((type) => (
                        <div key={type.id} className="relative">
                          <RadioGroupItem
                            value={type.id}
                            id={type.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={type.id}
                            className="flex flex-col rounded-lg border border-healing-200 bg-white p-4 hover:bg-healing-50 peer-data-[state=checked]:border-healing-500 peer-data-[state=checked]:bg-healing-50 [&:has([data-state=checked])]:border-healing-500"
                          >
                            <span className="text-sm font-medium">{type.name}</span>
                            <span className="text-xs text-gray-500 mt-1">
                              {type.description}
                            </span>
                            <div className="absolute top-4 right-4 opacity-0 transition-opacity peer-data-[state=checked]:opacity-100">
                              <Check className="h-4 w-4 text-healing-600" />
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
              
              <TabsContent value="goal-setting">
                <div className="space-y-4 mt-4">
                  <h3 className="text-lg font-medium">What are your recovery goals?</h3>
                  <p className="text-sm text-gray-600">
                    Setting clear goals helps focus your recovery journey. Enter one goal per line. Consider what healthy changes you'd like to make in your thoughts, feelings, or behaviors.
                  </p>
                  
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Example: Practice one mindful meal each day
Example: Challenge one negative body thought daily
Example: Connect with my support person weekly"
                      className="min-h-[150px]"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Effective goals are specific, measurable, achievable, relevant, and time-bound.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="disclaimer">
                <div className="space-y-4 mt-4">
                  <h3 className="text-lg font-medium">Important Information</h3>
                  
                  <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
                    <h4 className="text-sm font-medium text-amber-800 mb-2">
                      This app is a supportive tool, not a replacement for professional care
                    </h4>
                    <ul className="space-y-2 text-sm text-amber-700">
                      <li>• Recovery Journey provides support, education, and self-help tools but cannot diagnose or treat eating disorders.</li>
                      <li>• The AI chat feature offers empathetic support based on established therapeutic approaches but is not equivalent to therapy.</li>
                      <li>• If you're experiencing a crisis or emergency, please use the crisis resources provided or call emergency services.</li>
                      <li>• We strongly encourage you to work with healthcare professionals specializing in eating disorders alongside using this app.</li>
                    </ul>
                  </div>
                  
                  <div className="rounded-lg bg-healing-50 p-4 border border-healing-200 mt-4">
                    <h4 className="text-sm font-medium text-healing-800 mb-2">
                      Crisis Resources
                    </h4>
                    <p className="text-sm text-healing-700 mb-2">
                      If you're experiencing thoughts of self-harm or are in crisis:
                    </p>
                    <ul className="space-y-1 text-sm text-healing-700">
                      <li>• National Suicide Prevention Lifeline: 988 or 1-800-273-8255</li>
                      <li>• Crisis Text Line: Text HOME to 741741</li>
                      <li>• National Eating Disorders Association Helpline: 1-800-931-2237</li>
                      <li>• Or call your local emergency services: 911</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            {activeTab !== "disorder-type" && (
              <Button 
                variant="outline" 
                onClick={() => setActiveTab(activeTab === "disclaimer" ? "goal-setting" : "disorder-type")}
              >
                Back
              </Button>
            )}
            <div className="ml-auto">
              {activeTab !== "disclaimer" ? (
                <Button onClick={handleContinue} className="bg-healing-600 hover:bg-healing-700">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete} 
                  className="bg-healing-600 hover:bg-healing-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <span>Complete Setup</span>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
