
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import OnboardingWelcome from '@/components/OnboardingWelcome';
import OnboardingSteps from '@/components/OnboardingSteps';
import OnboardingDisorderSelect from '@/components/OnboardingDisorderSelect';
import OnboardingGoals from '@/components/OnboardingGoals';
import OnboardingAcknowledge from '@/components/OnboardingAcknowledge';
import ScrollReveal from '@/components/ScrollReveal';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animateOut, setAnimateOut] = useState(false);
  const navigate = useNavigate();
  const { updateUserProfile } = useAuth();

  // Add state variables for the onboarding process
  const [selectedDisorder, setSelectedDisorder] = useState<string | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [acknowledged, setAcknowledged] = useState(false);

  // Handle transition between steps with animation
  const handleStepChange = (nextStep: number) => {
    setAnimateOut(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setAnimateOut(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const handleCompleteOnboarding = () => {
    // Save the onboarding information
    updateUserProfile({ 
      onboardingCompleted: true,
      disorderType: selectedDisorder,
      goals: goals
    });
    
    // Animate out before navigating
    setAnimateOut(true);
    setTimeout(() => {
      // Navigate to dashboard
      navigate('/dashboard');
    }, 300);
  };

  const handleContinue = () => {
    handleStepChange(currentStep + 1);
  };

  const handleBack = () => {
    handleStepChange(currentStep - 1);
  };

  const toggleGoal = (goalId: string) => {
    setGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  // Determine if the next button should be disabled
  const isNextDisabled = () => {
    if (currentStep === 1 && !selectedDisorder) return true;
    if (currentStep === 2 && goals.length === 0) return true;
    if (currentStep === 3 && !acknowledged) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-healing-100 to-healing-200">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 0 ? (
          <div className={`transition-opacity duration-300 ${animateOut ? 'opacity-0' : 'opacity-100'}`}>
            <OnboardingWelcome onContinue={handleContinue} />
          </div>
        ) : (
          <div className={`transition-all duration-300 ${animateOut ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
            <ScrollReveal>
              <OnboardingSteps currentStep={currentStep} totalSteps={3} />
            </ScrollReveal>

            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
              {currentStep === 1 && (
                <OnboardingDisorderSelect 
                  selectedDisorder={selectedDisorder} 
                  onSelectDisorder={setSelectedDisorder} 
                />
              )}

              {currentStep === 2 && (
                <OnboardingGoals 
                  selectedGoals={goals} 
                  onToggleGoal={toggleGoal} 
                />
              )}

              {currentStep === 3 && (
                <OnboardingAcknowledge 
                  acknowledged={acknowledged} 
                  onAcknowledge={setAcknowledged} 
                />
              )}

              <ScrollReveal delay={400}>
                <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                  {currentStep > 1 && (
                    <Button 
                      variant="outline" 
                      onClick={handleBack}
                      className="order-2 sm:order-1"
                    >
                      Back
                    </Button>
                  )}
                  
                  <div className="flex-1 order-1 sm:order-2">
                    {isNextDisabled() && currentStep > 0 && (
                      <div className="flex items-center justify-center sm:justify-end text-amber-600 mb-4 text-sm">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span>Please complete this step before continuing</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={currentStep === 3 ? handleCompleteOnboarding : handleContinue}
                    disabled={isNextDisabled()}
                    className="bg-healing-600 hover:bg-healing-700 transition-all duration-300 order-3 sm:order-3"
                  >
                    {currentStep === 3 ? 'Complete & Continue' : 'Continue'}
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
