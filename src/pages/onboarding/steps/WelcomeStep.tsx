
import React from 'react';
import { Lightbulb, Users, Heart } from 'lucide-react';

const WelcomeStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome to Mindful Model</h2>
        <p className="text-muted-foreground">
          We're here to support you on your healing journey
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Personalized Support</h3>
            <p className="text-sm text-muted-foreground">
              We'll customize your experience based on your specific needs and goals
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Evidence-Based Approach</h3>
            <p className="text-sm text-muted-foreground">
              Our tools are designed with input from eating disorder specialists
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Safe Environment</h3>
            <p className="text-sm text-muted-foreground">
              Your privacy and wellbeing are our top priorities
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-mindful-neutral p-4 rounded-lg text-purple-900">
        <p className="text-sm">
          Let's start by setting up your profile to create the most helpful experience for you.
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;
