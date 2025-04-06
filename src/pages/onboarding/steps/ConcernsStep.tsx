
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ConcernsStepProps {
  concerns: string[];
  setConcerns: React.Dispatch<React.SetStateAction<string[]>>;
}

const ConcernsStep: React.FC<ConcernsStepProps> = ({ concerns, setConcerns }) => {
  const availableConcerns = [
    'Negative body image',
    'Restrictive eating',
    'Binge eating',
    'Purging behaviors',
    'Excessive exercise',
    'Fear of certain foods',
    'Obsessive calorie counting',
    'Meal anxiety',
    'Social eating situations',
    'Recovery maintenance',
    'Relapse prevention',
    'Emotional eating',
  ];
  
  const toggleConcern = (concern: string) => {
    if (concerns.includes(concern)) {
      setConcerns(concerns.filter((c) => c !== concern));
    } else {
      if (concerns.length < 3) {
        setConcerns([...concerns, concern]);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What Concerns You Most?</h2>
        <p className="text-muted-foreground">
          Select up to 3 areas you'd like to focus on
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableConcerns.map((concern) => (
          <Badge
            key={concern}
            variant={concerns.includes(concern) ? "default" : "outline"}
            className={`cursor-pointer ${
              concerns.includes(concern) 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-primary/10 hover:text-primary"
            }`}
            onClick={() => toggleConcern(concern)}
          >
            {concern}
          </Badge>
        ))}
      </div>
      
      {concerns.length === 3 && (
        <div className="text-xs text-muted-foreground">
          You've selected the maximum of 3 concerns. Deselect one if you'd like to choose another.
        </div>
      )}
      
      {concerns.length > 0 && (
        <div className="bg-mindful-neutral p-4 rounded-lg">
          <p className="font-medium mb-2">Your selected concerns:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {concerns.map((concern) => (
              <li key={concern}>{concern}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConcernsStep;
