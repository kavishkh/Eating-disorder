import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
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

// Inspirational quotes
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
  const { currentUser } = useAuth();
  const [quote, setQuote] = useState("");
  const [todayMood, setTodayMood] = useState<number | null>(null);

  useEffect(() => {
    // Get random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    // Get today's mood from mock data
    setTodayMood(mockMoodData[mockMoodData.length - 1].value);
  }, []);

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

        {/* Quote of the day */}
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

        {/* Main features */}
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

        {/* Progress section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Goals progress */}
          <Card className="border-healing-200">
            <CardHeader>
              <CardTitle className="flex items-center text-healing-800">
                <Star className="mr-2 h-5 w-5 text-healing-600" />
                Your Goals
              </CardTitle>
              <CardDescription>Track your progress on recovery goals</CardDescription>
            </CardHeader>
            <CardContent>
              {currentUser?.goals && currentUser.goals.length > 0 ? (
                <ul className="space-y-3">
                  {currentUser.goals.slice(0, 3).map((goal, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-healing-300 text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm">{goal}</span>
                    </li>
                  ))}
                  {currentUser.goals.length > 3 && (
                    <li className="text-sm text-healing-600 hover:text-healing-800">
                      <Link to="#" className="flex items-center">
                        View all goals <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </li>
                  )}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-2">You haven't set any goals yet</p>
                  <Button variant="outline" size="sm" className="border-healing-300 text-healing-700">
                    Add a Goal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mood chart */}
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
    </AppLayout>
  );
};

export default Dashboard;
