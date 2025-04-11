
import { useState } from 'react';
import { VisualizerTabs } from '@/components/visualizer/VisualizerTabs';
import { PortionVisualizer } from '@/components/visualizer/PortionVisualizer';
import { MealVisualizer } from '@/components/visualizer/MealVisualizer';
import { MindfulEatingVisualizer } from '@/components/visualizer/MindfulEatingVisualizer';

const Visualizer = () => {
  const [activeTab, setActiveTab] = useState('portions');
  
  const tabs = [
    {
      id: 'portions',
      label: 'Portions',
      content: <PortionVisualizer />
    },
    {
      id: 'meals',
      label: 'Balanced Meals',
      content: <MealVisualizer />
    },
    {
      id: 'mindful',
      label: 'Mindful Eating',
      content: <MindfulEatingVisualizer />
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">3D Food Visualizer</h1>
      
      <VisualizerTabs 
        defaultTab={activeTab} 
        tabs={tabs} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default Visualizer;
