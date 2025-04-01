import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import GoalCard from "@/components/GoalCard";
import ProgressCard from "@/components/ProgressCard";
import { Calendar, MessageCircle, Video } from "lucide-react";
import { Link } from "react-router-dom";

interface Goal {
  id: string;
  title: string;
  description: string;
}

const Dashboard = () => {
  const [userName, setUserName] = useState("User");
  const [goals, setGoals] = useState<(Goal & { isCompleted: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const storedName = localStorage.getItem("user_name");
    const storedGoals = localStorage.getItem("user_goals");

    if (!storedName || !storedGoals) {
      navigate("/onboarding/1");
      return;
    }

    setUserName(storedName);

    // Load goals
    const parsedGoals = JSON.parse(storedGoals);
    const goalsWithCompletion = parsedGoals.map((goal: Goal) => ({
      ...goal,
      isCompleted: false,
    }));

    setGoals(goalsWithCompletion);
    setIsLoading(false);
  }, [navigate]);

  const handleToggleGoal = (id: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, isCompleted: !goal.isCompleted } : goal
      )
    );
  };

  // Set progress to 0
  const progressPercentage = 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-pulse h-8 w-32 bg-gray-700 rounded mb-4 mx-auto"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar userName={userName} />

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-1 text-white">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-300">
            Here's an overview of your recovery journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ProgressCard
            title="Overall Progress"
            description="Your recovery journey progress based on completed goals"
            percentage={0}
            className="md:col-span-3"
          />
          <ProgressCard
            title="Weekly Check-ins"
            description="You've completed 0/5 check-ins this week"
            percentage={0}
          />
          <ProgressCard
            title="Mindfulness Sessions"
            description="You've completed 0/7 sessions this week"
            percentage={0}
          />
          <ProgressCard
            title="Educational Content"
            description="You've watched 0/10 recommended videos"
            percentage={0}
          />
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Your Recovery Goals
            </h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                title={goal.title}
                description={goal.description}
                isCompleted={goal.isCompleted}
                onToggle={() => handleToggleGoal(goal.id)}
                className="text-black"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/chat"
            className="card hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="bg-gray-700 p-4 rounded-full">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Support Chat</h3>
              <p className="text-sm text-gray-300">
                Get help with your challenges
              </p>
            </div>
          </Link>

          <Link
            to="/education"
            className="card hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="bg-gray-700 p-4 rounded-full">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Educational Content</h3>
              <p className="text-sm text-gray-300">
                Learn about recovery strategies
              </p>
            </div>
          </Link>

          <Link
            to="/progress"
            className="card hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="bg-gray-700 p-4 rounded-full">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Track Progress</h3>
              <p className="text-sm text-gray-300">
                Monitor your recovery journey
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
