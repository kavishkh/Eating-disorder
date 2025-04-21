import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProgress } from "../services/progressService";
import AppLayout from "../components/AppLayout";
import GoalsDialog from "../components/GoalsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  BarChart, 
  BookOpen, 
  AlertTriangle, 
  Heart, 
  Star, 
  Calendar,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockMoodData = [
  { date: "Mon", value: 3 },
  { date: "Tue", value: 2 },
  { date: "Wed", value: 4 },
  { date: "Thu", value: 3 },
  { date: "Fri", value: 5 },
  { date: "Sat", value: 4 },
  { date: "Sun", value: 4 },
];

const quotes = [
  "Recovery is not a race; it's a journey that we take one day at a time.",
  "Your body is an instrument, not an ornament.",
  "You are worthy of recovery and capable of change.",
  "Every step forward is a step worth celebrating.",
  "Healing happens when you feel heard, not when you're called broken.",
  "The most powerful relationship you will ever have is the relationship with yourself.",
  "Your worth is not measured by your weight or appearance.",
  "Nourish your body, mind, and soul with kindness and compassion.",
];

const Dashboard = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [quote, setQuote] = useState("");
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [isGoalsDialogOpen, setIsGoalsDialogOpen] = useState(false);
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Dashboard mounting, currentUser:", currentUser);
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    const storedMoods = localStorage.getItem('moodHistory');
    if (storedMoods) {
      try {
        const moodHistory = JSON.parse(storedMoods);
        if (moodHistory.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const todayEntry = moodHistory.find((entry: any) => entry.date === today);
          if (todayEntry) {
            setTodayMood(todayEntry.mood);
          }
        }
      } catch (error) {
        console.error("Failed to parse mood history:", error);
      }
    }
    
    if (currentUser?.goals) {
      setUserGoals(currentUser.goals);
    } else {
      const storedGoals = localStorage.getItem('userGoals');
      if (storedGoals) {
        try {
          const parsedGoals = JSON.parse(storedGoals);
          setUserGoals(parsedGoals);
        } catch (error) {
          console.error("Failed to parse goals:", error);
        }
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const updateDailyProgress = async () => {
      if (currentUser?.id) {
        try {
          const lastActiveDate = currentUser.progressMetrics?.lastActiveDate;
          const today = new Date().toISOString().split('T')[0];
          const wasActiveToday = lastActiveDate?.split('T')[0] === today;

          if (!wasActiveToday) {
            await updateUserProgress(currentUser.id, {
              streakDays: (currentUser.progressMetrics?.streakDays || 0) + 1,
              lastActiveDate: today
            });

            toast({
              title: "Progress Updated",
              description: "Your daily streak has been updated!",
            });
          }
        } catch (error) {
          console.error("Failed to update daily progress:", error);
        }
      }
    };

    updateDailyProgress();
  }, [currentUser]);

  const handleSaveGoals = async (goals: string[]) => {
    setUserGoals(goals);
    localStorage.setItem('userGoals', JSON.stringify(goals));
    
    if (currentUser && updateUserProfile) {
      try {
        await updateUserProfile({ goals });
        await updateUserProgress(currentUser.id, {
          totalGoals: goals.length
        });
        
        toast({
          title: "Goals updated",
          description: "Your goals have been saved successfully"
        });
      } catch (error) {
        console.error("Failed to update goals:", error);
        toast({
          title: "Error",
          description: "Failed to update goals. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-healing-900">
              Welcome{currentUser?.name ? `, ${currentUser.name}` : ""}
            </h2>
            <p className="mt-1 text-muted-foreground">
              Your recovery journey dashboard - what would you like to focus on today?
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-healing-600" />
            <span className="text-sm font-medium text-healing-800">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>

        <Card className="border-healing-200 bg-healing-50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="mr-4 mt-1 rounded-full bg-healing-100 p-2">
                <Heart className="h-6 w-6 text-healing-600" />
              </div>
              <div>
                <p className="text-lg italic text-healing-800">"{quote}"</p>
                <p className="mt-2 text-sm text-healing-600">Daily Inspiration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-hover border-healing-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-healing-800">
                <MessageCircle className="mr-2 h-5 w-5 text-healing-600" />
                AI Support Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Get empathetic support and guidance from your AI companion.</p>
              <Button asChild className="mt-4 w-full bg-healing-500 hover:bg-healing-600 text-white">
                <Link to="/chat">Start Chatting</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover border-healing-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-healing-800">
                <BarChart className="mr-2 h-5 w-5 text-healing-600" />
                Mood Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {todayMood ? "You haven't logged your mood today." : "Track your emotions to discover patterns."}
              </p>
              <Button asChild className="mt-4 w-full bg-healing-500 hover:bg-healing-600 text-white">
                <Link to="/mood">Log Your Mood</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover border-healing-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-healing-800">
                <BookOpen className="mr-2 h-5 w-5 text-healing-600" />
                Educational Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Explore articles, videos, and resources about recovery.</p>
              <Button asChild className="mt-4 w-full bg-healing-500 hover:bg-healing-600 text-white">
                <Link to="/learn">Explore</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover border-healing-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-healing-800">
                <AlertTriangle className="mr-2 h-5 w-5 text-healing-600" />
                Crisis Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Access immediate support if you're experiencing a crisis.</p>
              <Button asChild className="mt-4 w-full bg-healing-500 hover:bg-healing-600 text-white">
                <Link to="/crisis-resources">View Resources</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-healing-200">
            <CardHeader>
              <CardTitle className="flex items-center text-healing-800">
                <Star className="mr-2 h-5 w-5 text-healing-600" />
                Your Goals
              </CardTitle>
              <CardDescription>Track your progress on recovery goals</CardDescription>
            </CardHeader>
            <CardContent>
              {userGoals && userGoals.length > 0 ? (
                <ul className="space-y-3">
                  {userGoals.slice(0, 3).map((goal, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-healing-300 text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm">{goal}</span>
                    </li>
                  ))}
                  <li className="text-sm text-healing-600 hover:text-healing-800">
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto flex items-center text-healing-600 hover:text-healing-800"
                      onClick={() => setIsGoalsDialogOpen(true)}
                    >
                      View all goals <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </li>
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-2">You haven't set any goals yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-healing-300 text-healing-700"
                    onClick={() => setIsGoalsDialogOpen(true)}
                  >
                    Add a Goal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-healing-200">
            <CardHeader>
              <CardTitle className="flex items-center text-healing-800">
                <BarChart className="mr-2 h-5 w-5 text-healing-600" />
                Mood Trends
              </CardTitle>
              <CardDescription>Your mood patterns over the last week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[160px]">
                <div className="flex h-full w-full items-end justify-between">
                  {mockMoodData.map((day, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-healing-300 rounded-t-sm transition-all hover:bg-healing-500"
                        style={{ 
                          height: `${day.value * 20}%`,
                          backgroundColor: i === mockMoodData.length - 1 ? 'rgb(155, 135, 245)' : ''
                        }}
                      ></div>
                      <span className="mt-2 text-xs font-medium">{day.date}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-center">
                <Link to="/mood" className="text-sm text-healing-600 hover:text-healing-800 flex items-center justify-center">
                  View detailed mood history <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <GoalsDialog
        open={isGoalsDialogOpen}
        onOpenChange={setIsGoalsDialogOpen}
        goals={userGoals}
        onSaveGoals={handleSaveGoals}
      />
    </AppLayout>
  );
};

export default Dashboard;
