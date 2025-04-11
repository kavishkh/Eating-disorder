
import React, { useState, useEffect } from 'react';
import { CardContainer } from '@/components/ui/card-container';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { db } from '@/services/databaseService';

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
  darkColor: string;
  value: number;
}

export interface MoodData {
  day: string;
  value: number;
}

export const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const moods: MoodOption[] = [
    { emoji: '😞', label: 'Struggling', color: 'bg-mindful-danger/20', darkColor: 'bg-mindful-danger/30', value: 1 },
    { emoji: '😐', label: 'Neutral', color: 'bg-mindful-neutral/20', darkColor: 'bg-mindful-neutral/30', value: 3 },
    { emoji: '🙂', label: 'Good', color: 'bg-mindful-info/20', darkColor: 'bg-mindful-info/30', value: 4 },
    { emoji: '😀', label: 'Great', color: 'bg-mindful-success/20', darkColor: 'bg-mindful-success/30', value: 5 },
  ];
  
  useEffect(() => {
    // Check if we have a mood stored for today
    const checkTodayMood = async () => {
      const weekMoods = await db.getMoodForWeek();
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      
      if (weekMoods[today] > 0) {
        const selectedOption = moods.find(m => m.value === weekMoods[today]);
        if (selectedOption) {
          setSelectedMood(selectedOption.label);
        }
      }
    };
    
    checkTodayMood();
  }, []);
  
  const handleMoodSelect = async (mood: MoodOption) => {
    setSelectedMood(mood.label);
    
    // Save mood to database
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    await db.addMood(mood.value, today);
    
    // Also add a progress record for mental health
    await db.addProgressRecord('mental_health', mood.value * 20); // Convert 1-5 scale to percentage
    
    // Generate updated mood data for chart
    const moodHistory = await db.getMoodForWeek();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const updatedMoodData: MoodData[] = days.map(d => {
      return { day: d, value: moodHistory[d] || 0 };
    });

    localStorage.setItem('moodChartData', JSON.stringify(updatedMoodData));
    
    toast.success(`Mood logged: ${mood.label}`);
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
