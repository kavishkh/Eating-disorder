
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Goal {
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timely: string;
}

interface GoalsStepProps {
  goals: Goal;
  setGoals: React.Dispatch<React.SetStateAction<Goal>>;
}

const GoalsStep: React.FC<GoalsStepProps> = ({ goals, setGoals }) => {
  const handleGoalChange = (field: keyof Goal, value: string) => {
    setGoals((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Set Your SMART Goal</h2>
        <p className="text-muted-foreground">
          Setting specific, measurable, achievable, relevant, and time-bound goals helps your recovery journey
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="specific">
            Specific: What exactly do you want to accomplish?
          </Label>
          <Textarea
            id="specific"
            placeholder="e.g., I want to eat three balanced meals each day"
            value={goals.specific}
            onChange={(e) => handleGoalChange('specific', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="measurable">
            Measurable: How will you track your progress?
          </Label>
          <Textarea
            id="measurable"
            placeholder="e.g., I will log my meals in this app daily"
            value={goals.measurable}
            onChange={(e) => handleGoalChange('measurable', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="achievable">
            Achievable: Is this goal realistic right now?
          </Label>
          <Textarea
            id="achievable"
            placeholder="e.g., I already eat 1-2 meals per day, so adding one more is achievable"
            value={goals.achievable}
            onChange={(e) => handleGoalChange('achievable', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="relevant">
            Relevant: Why is this goal important to you?
          </Label>
          <Textarea
            id="relevant"
            placeholder="e.g., Regular meals will help stabilize my mood and energy"
            value={goals.relevant}
            onChange={(e) => handleGoalChange('relevant', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timely">
            Timely: What's your timeframe for this goal?
          </Label>
          <Textarea
            id="timely"
            placeholder="e.g., I will achieve this consistently within 2 weeks"
            value={goals.timely}
            onChange={(e) => handleGoalChange('timely', e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-mindful-info/20 p-4 rounded-lg">
        <p className="text-sm">
          Remember: Start with small, achievable goals. You can always revise them as you make progress.
        </p>
      </div>
    </div>
  );
};

export default GoalsStep;
