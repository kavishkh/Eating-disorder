
import React, { useState, useEffect } from 'react';
import { CardContainer } from '@/components/ui/card-container';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
  darkColor: string;
  value: number;
}

export const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const moods: MoodOption[] = [
    { emoji: '😞', label: 'Struggling', color: 'bg-mindful-danger/20', darkColor: 'bg-mindful-danger/30', value: 1 },
    { emoji: '😐', label: 'Neutral', color: 'bg-mindful-neutral/20', darkColor: 'bg-mindful-neutral/30', value: 2 },
    { emoji: '🙂', label: 'Good', color: 'bg-mindful-info/20', darkColor: 'bg-mindful-info/30', value: 4 },
    { emoji: '😀', label: 'Great', color: 'bg-mindful-success/20', darkColor: 'bg-mindful-success/30', value: 5 },
  ];
  
  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood.label);
    
    // Save mood to localStorage for demo purposes
    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Get existing history or create new
    const moodHistory = localStorage.getItem('moodHistory') 
      ? JSON.parse(localStorage.getItem('moodHistory') || '{}') 
      : {};
    
    // Update today's mood
    moodHistory[day] = mood.value;
    
    // Save back to localStorage
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    
    toast.success(`Mood logged: ${mood.label}`);
    // In a real app, this would save to user's data
  };
  
  return (
    <div className="flex justify-between gap-2">
      {moods.map((mood, index) => (
        <motion.button
          key={mood.label}
          className={`flex-1 flex flex-col items-center p-3 rounded-lg transition-all ${
            selectedMood === mood.label
              ? `${mood.darkColor} ring-2 ring-primary`
              : `${mood.color} hover:${mood.darkColor} hover:brightness-125`
          }`}
          onClick={() => handleMoodSelect(mood)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
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
        </motion.button>
      ))}
    </div>
  );
};
