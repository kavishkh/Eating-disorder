import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

// Mock mood data
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
];

const Dashboard = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [isGoalsDialogOpen, setIsGoalsDialogOpen] = useState(false);
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if onboarding not completed
    if (currentUser && !currentUser.onboardingCompleted) {
      navigate('/onboarding', { replace: true });
      return;
    }

    // Get random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    // Load user goals
    if (currentUser?.goals) {
      setUserGoals(currentUser.goals);
    }
  }, [currentUser, navigate]);

  const handleSaveGoals = async (goals: string[]) => {
    try {
      setUserGoals(goals);
      await updateUserProfile({ goals });
      
      toast({
        title: "Goals updated",
        description: "Your goals have been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save goals",
        variant: "destructive"
      });
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
              Your recovery journey dashboard
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-healing-600" />
            <span className="text-sm font-medium text-healing-800">
              {new Date().toLocaleDateString("en-US", { 
                weekday: "long", 
                month: "long", 
                day: "numeric" 
              })}
            </span>
          </div>
        </div>

        {/* Rest of your dashboard UI remains the same */}
        {/* ... */}

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