
import React, { useState } from 'react';
import { CardContainer } from '@/components/ui/card-container';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
  darkColor: string;
}

export const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const moods: MoodOption[] = [
    { emoji: '😞', label: 'Struggling', color: 'bg-mindful-danger/20', darkColor: 'bg-mindful-danger/30' },
    { emoji: '😐', label: 'Neutral', color: 'bg-mindful-neutral/20', darkColor: 'bg-mindful-neutral/30' },
    { emoji: '🙂', label: 'Good', color: 'bg-mindful-info/20', darkColor: 'bg-mindful-info/30' },
    { emoji: '😀', label: 'Great', color: 'bg-mindful-success/20', darkColor: 'bg-mindful-success/30' },
  ];
  
  const handleMoodSelect = (label: string) => {
    setSelectedMood(label);
    toast.success(`Mood logged: ${label}`);
    // In a real app, this would save to user's data
  };
  
  return (
    <CardContainer 
      title="How are you feeling?" 
      description="Track your mood to help monitor your progress"
      variant="dark-gradient"
      className="card-hover"
    >
      <div className="flex justify-between gap-2">
        {moods.map((mood, index) => (
          <button
            key={mood.label}
            className={`flex-1 flex flex-col items-center p-3 rounded-lg transition-all ${
              selectedMood === mood.label
                ? `${mood.darkColor} ring-2 ring-primary`
                : `${mood.darkColor} hover:${mood.darkColor} hover:brightness-125`
            }`}
            onClick={() => handleMoodSelect(mood.label)}
          >
            <motion.span 
              className="text-2xl mb-1"
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: selectedMood === mood.label ? 1.2 : 1,
                y: selectedMood === mood.label ? -5 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              {mood.emoji}
            </motion.span>
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </CardContainer>
  );
};
