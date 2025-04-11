
import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

const DisclaimerStep: React.FC = () => {
  const emergencyResources = [
    {
      name: "National Eating Disorders Association Helpline",
      phone: "1-800-931-2237",
      description: "Available Mon-Thu 9am-9pm ET, Fri 9am-5pm ET"
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Available 24/7"
    },
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988 or 1-800-273-8255",
      description: "Available 24/7"
    }
  ];

  return (
    <div className="space-y-6 ">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Important Information</h2>
        <p className="text-muted-foreground">
          Please review this important disclaimer before continuing
        </p>
      </div>
      
      <div className="bg-destructive/10 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">This app is not a substitute for professional help</p>
          <p>
            Mindful Model is designed to be used alongside professional treatment, not as a replacement. The app does not diagnose, treat, or cure any medical condition.
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Emergency Resources</h3>
        <div className="space-y-3">
          {emergencyResources.map((resource) => (
            <div key={resource.name} className="bg-mindful-neutral p-3 rounded-lg text-primary">
              <p className="font-medium">{resource.name}</p>
              <p className="text-primary text-lg font-bold">{resource.phone}</p>
              <p className="text-xs text-muted-foreground">{resource.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-sm">
          By continuing, you acknowledge that you understand the limitations of this application and that you will seek professional help if needed.
        </p>
        <p className="text-sm mt-2">
          If you're experiencing thoughts of harming yourself or others, please contact emergency services or one of the crisis resources immediately.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerStep;
