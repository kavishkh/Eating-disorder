
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import WelcomeStep from './steps/WelcomeStep';
import ConcernsStep from './steps/ConcernsStep';
import GoalsStep from './steps/GoalsStep';
import DisclaimerStep from './steps/DisclaimerStep';

const steps = ['welcome', 'concerns', 'goals', 'disclaimer'];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [goals, setGoals] = useState<{
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timely: string;
  }>({
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timely: '',
  });
  
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const completeOnboarding = () => {
    // Save onboarding data
    const onboardingData = {
      concerns,
      goals,
    };
    
    // Update user as onboarded
    updateUser({ 
      isOnboarded: true,
      // Would include other user fields here in a real app
    });
    
    // Save onboarding data to localStorage (in a real app this would go to a server)
    localStorage.setItem('mindfulOnboardingData', JSON.stringify(onboardingData));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  
  // Render current step content
  const renderStepContent = () => {
    switch (steps[currentStep]) {
      case 'welcome':
        return <WelcomeStep />;
      case 'concerns':
        return <ConcernsStep concerns={concerns} setConcerns={setConcerns} />;
      case 'goals':
        return <GoalsStep goals={goals} setGoals={setGoals} />;
      case 'disclaimer':
        return <DisclaimerStep />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/30 py-6">
      <div className="container max-w-md mx-auto px-4">
        {/* Progress bar */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>
        
        {/* Step content */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {renderStepContent()}
          </CardContent>
        </Card>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? (
              <>
                Next <ChevronRight size={16} className="ml-1" />
              </>
            ) : (
              <>
                Complete <Check size={16} className="ml-1" />
              </>
            )}
          </Button>
        </div>
        
        {/* Skip onboarding option */}
        {currentStep < steps.length - 1 && (
          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              className="text-muted-foreground text-sm"
              onClick={completeOnboarding}
            >
              Skip for now (you can complete this later)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
