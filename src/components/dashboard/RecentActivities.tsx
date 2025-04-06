
import React from 'react';
import { CardContainer } from '@/components/ui/card-container';
import { MessageSquare, Lightbulb, Box } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  type: 'chat' | 'learning' | 'visualization';
  title: string;
  description: string;
  timestamp: Date;
}

export const RecentActivities: React.FC = () => {
  // Mock data - in a real app this would come from user activity history
  const activities: Activity[] = [
    {
      id: '1',
      type: 'chat',
      title: 'Support Chat',
      description: 'Discussed coping strategies for meal anxiety',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: '2',
      type: 'learning',
      title: 'Completed Lesson',
      description: 'Understanding hunger and fullness cues',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      type: 'visualization',
      title: 'Balanced Meal Visualization',
      description: 'Explored healthy lunch portions',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ];
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'learning':
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
      case 'visualization':
        return <Box className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'chat':
        return 'bg-mindful-info/20';
      case 'learning':
        return 'bg-mindful-warning/20';
      case 'visualization':
        return 'bg-mindful-success/20';
      default:
        return 'bg-secondary';
    }
  };
  
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    
    return `${Math.floor(seconds)}s ago`;
  };
  
  return (
    <CardContainer 
      title="Recent Activities" 
      variant="gradient"
      className="card-hover"
    >
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
          >
            <div className={`${getActivityColor(activity.type)} p-2 rounded-full`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium">{activity.title}</h4>
                <Badge variant="outline" className="text-xs font-normal">
                  {formatTimeAgo(activity.timestamp)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContainer>
  );
};
