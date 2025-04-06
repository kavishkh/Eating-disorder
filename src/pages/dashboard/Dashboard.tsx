
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardContainer } from '@/components/ui/card-container';
import { ProgressCircle } from '@/components/dashboard/ProgressCircle';
import { MoodTracker } from '@/components/dashboard/MoodTracker';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { MessageSquare, Box, Lightbulb, ArrowRight, User, Flag, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [goalProgress, setGoalProgress] = useState<number>(0);
  const [goalTitle, setGoalTitle] = useState<string>('Eat three balanced meals per day');
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
    
    // For new members, progress is set to 0
    const isNewMember = !localStorage.getItem('mindfulProgressData');
    
    if (isNewMember) {
      setGoalProgress(0);
      // Store initial progress data for future sessions
      localStorage.setItem('mindfulProgressData', JSON.stringify({ 
        progress: 0, 
        lastUpdate: new Date().toISOString(),
        goalTitle: "Set your first goal"
      }));
    } else {
      // For returning users, get their stored progress or default to 0
      try {
        const progressData = JSON.parse(localStorage.getItem('mindfulProgressData') || '{}');
        setGoalProgress(progressData.progress || 0);
        if (progressData.goalTitle) {
          setGoalTitle(progressData.goalTitle);
        }
      } catch (error) {
        setGoalProgress(0);
        console.error("Error loading progress data:", error);
      }
    }
  }, []);

  const quickAccess = [
    {
      title: 'Chat Support',
      description: 'Talk with our AI support system about your concerns',
      icon: MessageSquare,
      color: 'bg-mindful-info/30',
      textColor: 'text-blue-400',
      path: '/chat',
    },
    {
      title: '3D Food Visualizer',
      description: 'Interactive food portion and meal visualizations',
      icon: Box,
      color: 'bg-mindful-success/30',
      textColor: 'text-green-400',
      path: '/visualizer',
    },
    {
      title: 'Educational Content',
      description: 'Learn about eating disorders and recovery',
      icon: Lightbulb,
      color: 'bg-mindful-warning/30',
      textColor: 'text-amber-400',
      path: '/learn',
    },
    {
      title: 'My Goals',
      description: 'Set and track your recovery objectives',
      icon: Flag,
      color: 'bg-mindful-lavender/30',
      textColor: 'text-purple-400',
      path: '/goals',
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account preferences',
      icon: User,
      color: 'bg-mindful-neutral/30',
      textColor: 'text-gray-400',
      path: '/profile',
    },
  ];
  
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header with greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gradient-dark">
          Good {timeOfDay}, {currentUser?.name || 'there'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          How are you feeling today?
        </p>
      </div>
      
      {/* Mood tracker */}
      <MoodTracker />
      
      {/* Goal progress */}
      <CardContainer 
        title="Goal Progress" 
        description="Track your recovery milestones"
        variant="dark-gradient"
        className="card-hover"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium mb-1">Current Goal</p>
            <p className="text-sm text-muted-foreground">{goalTitle}</p>
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm flex items-center mt-2"
              onClick={() => navigate('/goals')}
            >
              {goalProgress === 0 ? "Set goals" : "Update goal"} <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <ProgressCircle progress={goalProgress} />
        </div>
      </CardContainer>
      
      {/* Feature cards */}
      <h2 className="text-lg font-medium mt-8 mb-3 flex items-center">
        <Sparkles className="h-5 w-5 mr-2 text-mindful-primary" /> 
        Quick Access
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {quickAccess.map((item, index) => (
          <Card 
            key={item.title} 
            className="hover:shadow-md transition-shadow cursor-pointer card-hover animate-scale-in dark-gradient"
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: 0
            }}
            onClick={() => navigate(item.path)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`${item.color} p-3 rounded-full`}>
                <item.icon className={`h-5 w-5 ${item.textColor}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Button size="icon" variant="ghost" className="ml-auto">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Recent activities */}
      <RecentActivities />
    </div>
  );
};

export default Dashboard;
