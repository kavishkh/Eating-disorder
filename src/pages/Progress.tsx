
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Smile, Meh, Frown, XCircle } from "lucide-react";

// Reset all progress data to 0
const weeklyMoodData = [
  { day: "Mon", mood: 0 },
  { day: "Tue", mood: 0 },
  { day: "Wed", mood: 0 },
  { day: "Thu", mood: 0 },
  { day: "Fri", mood: 0 },
  { day: "Sat", mood: 0 },
  { day: "Sun", mood: 0 }
];

const monthlyProgressData = [
  { week: "Week 1", mealCompletion: 0, anxietyLevel: 0 },
  { week: "Week 2", mealCompletion: 0, anxietyLevel: 0 },
  { week: "Week 3", mealCompletion: 0, anxietyLevel: 0 },
  { week: "Week 4", mealCompletion: 0, anxietyLevel: 0 }
];

// Mock journal entries
const journalEntries = [
  { date: new Date(2023, 4, 15), title: "Challenging meal success", content: "I was able to eat at a restaurant with friends without anxiety for the first time in months." },
  { date: new Date(2023, 4, 12), title: "Difficult day", content: "Struggled with body image today but used my coping skills from therapy." },
  { date: new Date(2023, 4, 8), title: "Therapy insights", content: "My therapist helped me understand how my perfectionism relates to my eating disorder." }
];

const Progress = () => {
  const [userName, setUserName] = useState("User");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEntry, setSelectedEntry] = useState<typeof journalEntries[0] | null>(null);
  const [showMoodDialog, setShowMoodDialog] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user has completed onboarding
    const storedName = localStorage.getItem("user_name");
    
    if (!storedName) {
      navigate("/onboarding/1");
      return;
    }
    
    setUserName(storedName);
  }, [navigate]);
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    
    // Find journal entry for the selected date
    if (selectedDate) {
      const entry = journalEntries.find(
        entry => 
          entry.date.getDate() === selectedDate.getDate() &&
          entry.date.getMonth() === selectedDate.getMonth() &&
          entry.date.getFullYear() === selectedDate.getFullYear()
      );
      
      setSelectedEntry(entry || null);
    }
  };

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    
    // Show toast notification based on mood selection
    const messages = {
      "happy": "Great to hear you're feeling good after your meal!",
      "neutral": "Thanks for sharing how you're feeling after eating.",
      "sad": "I'm sorry you're not feeling great. Remember to be kind to yourself."
    };
    
    setTimeout(() => {
      toast({
        title: "Mood Tracked",
        description: messages[mood as keyof typeof messages],
      });
      setShowMoodDialog(false);
    }, 500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar userName={userName} />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Your Recovery Progress</h1>
        
        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="charts">Progress Charts</TabsTrigger>
            <TabsTrigger value="journal">Recovery Journal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts" className="space-y-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Weekly Mood Tracking</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyMoodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 10]} label={{ value: 'Mood (1-10)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#000000"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Monthly Recovery Trends</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="mealCompletion"
                      name="Meal Completion %"
                      stroke="#000000"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="anxietyLevel"
                      name="Anxiety Level (1-10)"
                      stroke="#555555"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="journal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 md:col-span-1">
                <h2 className="text-lg font-semibold mb-4">Select Date</h2>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                />
                <div className="mt-4">
                  <h3 className="font-medium">Journal Entries</h3>
                  <div className="mt-2 space-y-2">
                    {journalEntries.map((entry, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded-md cursor-pointer text-sm ${
                          selectedEntry === entry ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          setDate(entry.date);
                          setSelectedEntry(entry);
                        }}
                      >
                        {entry.date.toLocaleDateString()} - {entry.title}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 md:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Journal Entry</h2>
                
                {selectedEntry ? (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-medium">{selectedEntry.title}</h3>
                      <span className="text-sm text-gray-500">
                        {selectedEntry.date.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{selectedEntry.content}</p>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>No journal entry for the selected date.</p>
                    <p className="mt-2 text-sm">Select a different date or create a new entry.</p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <button className="button-outline">Create New Entry</button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Mood Dialog */}
        <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
          <DialogContent className="bg-gradient-to-r from-purple-50 to-pink-50 border-none">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                How are you feeling after your meal today?
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 flex flex-col items-center">
              <div className="flex gap-6 justify-center mt-4">
                <button 
                  className="mood-button bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600" 
                  onClick={() => handleMoodSelection("happy")}
                >
                  <Smile size={40} className="text-white mb-1" />
                  <span className="text-white">Good</span>
                </button>
                
                <button 
                  className="mood-button bg-gradient-to-br from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600" 
                  onClick={() => handleMoodSelection("neutral")}
                >
                  <Meh size={40} className="text-white mb-1" />
                  <span className="text-white">Neutral</span>
                </button>
                
                <button 
                  className="mood-button bg-gradient-to-br from-pink-400 to-red-500 hover:from-pink-500 hover:to-red-600" 
                  onClick={() => handleMoodSelection("sad")}
                >
                  <Frown size={40} className="text-white mb-1" />
                  <span className="text-white">Difficult</span>
                </button>
              </div>
              
              <p className="text-gray-500 mt-8 text-center max-w-sm">
                Tracking how you feel after meals can help identify patterns and improve your recovery journey.
              </p>
              
              <Button 
                variant="outline" 
                onClick={() => setShowMoodDialog(false)} 
                className="mt-6 border-gray-300"
              >
                Skip for now
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Progress;
