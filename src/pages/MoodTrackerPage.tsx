
import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Smile,
  Frown,
  Meh,
  Calendar,
  BarChart2,
  Check,
  CalendarDays,
} from "lucide-react";

// Mock mood history data
const mockMoodHistory = [
  { date: "2025-04-10", mood: 4, note: "Felt calm after practicing mindfulness." },
  { date: "2025-04-09", mood: 2, note: "Struggled with body image today." },
  { date: "2025-04-08", mood: 5, note: "Had a good session with my therapist!" },
  { date: "2025-04-07", mood: 3, note: "Mixed feelings about food choices." },
  { date: "2025-04-06", mood: 3, note: "Neutral day, practiced self-care." },
  { date: "2025-04-05", mood: 2, note: "Felt anxious about eating with others." },
  { date: "2025-04-04", mood: 4, note: "Made progress on my recovery goals." },
];

// Mood definitions
const moodDefinitions = [
  { value: 1, label: "Very Low", icon: Frown, color: "text-red-500", bg: "bg-red-100" },
  { value: 2, label: "Low", icon: Frown, color: "text-orange-500", bg: "bg-orange-100" },
  { value: 3, label: "Neutral", icon: Meh, color: "text-yellow-500", bg: "bg-yellow-100" },
  { value: 4, label: "Good", icon: Smile, color: "text-green-500", bg: "bg-green-100" },
  { value: 5, label: "Great", icon: Smile, color: "text-emerald-500", bg: "bg-emerald-100" },
];

const MoodTrackerPage = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [moodHistory, setMoodHistory] = useState(mockMoodHistory);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (selectedMood === null) {
      toast({
        title: "Please select a mood",
        description: "You need to select how you're feeling today",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Add new mood entry to history
    const newEntry = {
      date: new Date().toISOString().split("T")[0],
      mood: selectedMood,
      note: note,
    };

    setTimeout(() => {
      setMoodHistory([newEntry, ...moodHistory]);
      setSelectedMood(null);
      setNote("");
      setIsSubmitting(false);
      
      toast({
        title: "Mood logged successfully",
        description: "Your mood has been recorded for today",
      });
    }, 1000);
  };

  // Get mood details based on value
  const getMoodDetails = (value: number) => {
    return moodDefinitions.find(mood => mood.value === value) || moodDefinitions[2]; // Default to neutral
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-healing-900">Mood Tracker</h2>
          <p className="text-muted-foreground">
            Track your emotional well-being and identify patterns in your recovery journey
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Log Mood Card */}
          <Card className="border-healing-200">
            <CardHeader>
              <CardTitle className="flex items-center text-healing-800">
                <Calendar className="mr-2 h-5 w-5 text-healing-600" />
                Log Today's Mood
              </CardTitle>
              <CardDescription>How are you feeling today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mood Selection */}
              <div className="grid grid-cols-5 gap-2">
                {moodDefinitions.map((mood) => {
                  const MoodIcon = mood.icon;
                  return (
                    <Button
                      key={mood.value}
                      variant="outline"
                      className={`flex flex-col h-auto py-3 border-healing-200 ${
                        selectedMood === mood.value
                          ? "border-healing-500 bg-healing-50 ring-1 ring-healing-500"
                          : ""
                      }`}
                      onClick={() => setSelectedMood(mood.value)}
                    >
                      <MoodIcon className={`h-6 w-6 mb-1 ${mood.color}`} />
                      <span className="text-xs font-normal">{mood.label}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes (optional)
                </label>
                <Textarea
                  id="notes"
                  placeholder="How would you describe your feelings or experiences today?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="h-24 resize-none border-healing-200"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                className="w-full bg-healing-500 hover:bg-healing-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    <span>Save Mood Entry</span>
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Mood Chart */}
          <Card className="border-healing-200">
            <CardHeader>
              <CardTitle className="flex items-center text-healing-800">
                <BarChart2 className="mr-2 h-5 w-5 text-healing-600" />
                Mood Trends
              </CardTitle>
              <CardDescription>Your mood patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <div className="flex h-full w-full items-end justify-between">
                  {moodHistory.slice(0, 7).reverse().map((entry, i) => {
                    const moodDetail = getMoodDetails(entry.mood);
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className={`w-8 rounded-t-sm transition-all hover:opacity-80 ${moodDetail.bg}`}
                          style={{ height: `${entry.mood * 18}%` }}
                        ></div>
                        <span className="mt-2 text-xs">{new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" })}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                Viewing the last 7 days
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood History */}
        <Card className="border-healing-200">
          <CardHeader>
            <CardTitle className="flex items-center text-healing-800">
              <CalendarDays className="mr-2 h-5 w-5 text-healing-600" />
              Mood History
            </CardTitle>
            <CardDescription>Review your past mood entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodHistory.map((entry, index) => {
                const moodDetail = getMoodDetails(entry.mood);
                const MoodIcon = moodDetail.icon;
                return (
                  <div key={index} className="flex border-b border-healing-100 pb-4 last:border-0 last:pb-0">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full mr-4 ${moodDetail.bg}`}>
                      <MoodIcon className={`h-5 w-5 ${moodDetail.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{moodDetail.label}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleDateString("en-US", { 
                            year: "numeric", 
                            month: "short", 
                            day: "numeric" 
                          })}
                        </span>
                      </div>
                      {entry.note && <p className="mt-1 text-sm text-gray-600">{entry.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MoodTrackerPage;
