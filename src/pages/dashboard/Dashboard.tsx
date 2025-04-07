
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, MessageSquare, Eye, Flag, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CardContainer } from '@/components/ui/card-container';
import { MoodTracker } from '@/components/dashboard/MoodTracker';
import { ProgressCircle } from '@/components/dashboard/ProgressCircle';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

// Generate empty mood data for new users
const generateEmptyMoodData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({ day, value: 0 }));
};

// Mock data for returning users' charts
const sampleMoodData = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 2 },
  { day: 'Wed', value: 4 },
  { day: 'Thu', value: 3 },
  { day: 'Fri', value: 5 },
  { day: 'Sat', value: 4 },
  { day: 'Sun', value: 4 },
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState(generateEmptyMoodData());
  const [isNewUser, setIsNewUser] = useState(true);

  useEffect(() => {
    // In a real app, we would check if the user has logged moods
    // For demo purposes, we'll check localStorage
    const hasMoodHistory = localStorage.getItem('moodHistory');
    
    if (hasMoodHistory) {
      setMoodData(sampleMoodData);
      setIsNewUser(false);
    } else {
      setMoodData(generateEmptyMoodData());
      setIsNewUser(true);
    }
  }, []);

  // Define action cards for quick access
  const actionCards = [
    {
      title: "Daily Check-in",
      description: "Record your thoughts and feelings",
      icon: MessageSquare,
      color: "bg-mindful-primary/10",
      textColor: "text-mindful-primary",
      path: "/chat"
    },
    {
      title: "Learn",
      description: "Explore educational resources",
      icon: BookOpen,
      color: "bg-mindful-secondary/10",
      textColor: "text-mindful-secondary",
      path: "/learn"
    },
    {
      title: "Visualizer",
      description: "See your progress in 3D",
      icon: Eye,
      color: "bg-mindful-tertiary/10",
      textColor: "text-mindful-tertiary",
      path: "/visualizer"
    },
    {
      title: "Goals",
      description: "Check your recovery goals",
      icon: Flag,
      color: "bg-mindful-peach/30",
      textColor: "text-mindful-primary", 
      path: "/goals"
    }
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {/* Welcome section */}
        <CardContainer variant="frosted" className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name}!</h1>
              <p className="text-muted-foreground">
                {isNewUser 
                  ? "Let's start your healing journey" 
                  : "Let's continue your healing journey"}
              </p>
            </div>
            <Progress value={isNewUser ? 5 : 65} className="w-full sm:w-1/3 mt-4 sm:mt-0" />
          </div>
        </CardContainer>

        {/* Main sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mood tracker */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-1"
          >
            <CardContainer variant="colorful" title="Mood Tracker" description="How are you feeling today?">
              <MoodTracker />
            </CardContainer>
          </motion.div>

          {/* Mood chart */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-2"
          >
            <CardContainer variant="glass" title="Mood Graph" description={isNewUser ? "Track your first mood to begin" : "Your past week"}>
              <div className="h-[200px]">
                <ChartContainer 
                  config={{ 
                    mood: { color: "#9b87f5" }
                  }}
                >
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 5]} />
                    <ChartTooltip content={(data) => (
                      <div className="bg-background/80 p-2 rounded-md shadow-lg border border-border text-xs">
                        <p>Day: {data.payload?.[0]?.payload?.day}</p>
                        <p>Mood: {data.payload?.[0]?.value || 'Not recorded'}</p>
                      </div>
                    )} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="mood"
                      stroke="#9b87f5"
                      strokeWidth={2}
                      dot={{ fill: '#9b87f5', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#7E69AB' }}
                    />
                  </LineChart>
                </ChartContainer>
                
                {isNewUser && (
                  <div className="text-center mt-4 text-muted-foreground">
                    <p>Start tracking your mood to see your progress here</p>
                  </div>
                )}
              </div>
            </CardContainer>
          </motion.div>
        </div>

        {/* Quick access cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CardContainer variant="frosted" title="Quick Access" className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {actionCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <div
                      className={`h-full cursor-pointer border border-transparent hover:border-primary/20 ${card.color} rounded-lg p-4 transition-all`}
                      onClick={() => navigate(card.path)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-3 rounded-full mb-3 ${card.color} group-hover:scale-110 transition-transform`}>
                          <Icon className={`h-6 w-6 ${card.textColor}`} />
                        </div>
                        <h3 className="font-medium text-lg">{card.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContainer>
        </motion.div>

        {/* Progress and Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <CardContainer variant="glass" title="Weekly Progress" description={isNewUser ? "Complete activities to track progress" : "You're making great strides!"}>
              <div className="flex justify-around">
                <ProgressCircle progress={isNewUser ? 0 : 75} />
                <ProgressCircle progress={isNewUser ? 0 : 60} />
                <ProgressCircle progress={isNewUser ? 0 : 40} />
              </div>
            </CardContainer>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <CardContainer variant="colorful" title="Recent Activities">
              <RecentActivities />
              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Activities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContainer>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
