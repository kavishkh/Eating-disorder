
import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VisualizerTabsProps {
  defaultTab: string;
  tabs: {
    id: string;
    label: string;
    content: ReactNode;
  }[];
  onTabChange: (tab: string) => void;
}

export const VisualizerTabs = ({ defaultTab, tabs, onTabChange }: VisualizerTabsProps) => {
  return (
    <Tabs defaultValue={defaultTab} onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-3 mb-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
