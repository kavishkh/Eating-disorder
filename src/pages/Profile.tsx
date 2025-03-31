
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user has completed onboarding
    const storedName = localStorage.getItem("user_name");
    const storedEmail = localStorage.getItem("user_email");
    
    if (!storedName || !storedEmail) {
      navigate("/onboarding/1");
      return;
    }
    
    setUserName(storedName);
    setEmail(storedEmail);
  }, [navigate]);
  
  const handleSaveChanges = () => {
    setIsLoading(true);
    
    // Update localStorage
    localStorage.setItem("user_name", userName);
    localStorage.setItem("user_email", email);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    }, 1000);
  };
  
  const handleLogout = () => {
    // Clear all localStorage
    localStorage.clear();
    
    // Navigate to onboarding
    navigate("/onboarding/1");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar userName={userName} />
      
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="input-field"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive updates about your recovery progress
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-reminders">Daily Check-in Reminders</Label>
                    <p className="text-sm text-gray-500">
                      Receive daily reminders to track your progress
                    </p>
                  </div>
                  <Switch
                    id="daily-reminders"
                    checked={dailyReminders}
                    onCheckedChange={setDailyReminders}
                    disabled={!notifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports">Weekly Progress Reports</Label>
                    <p className="text-sm text-gray-500">
                      Receive weekly summaries of your recovery journey
                    </p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={weeklyReports}
                    onCheckedChange={setWeeklyReports}
                    disabled={!notifications}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Privacy & Security</h2>
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  Data Management
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex-1"
            >
              Logout
            </Button>
            
            <Button
              onClick={handleSaveChanges}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
