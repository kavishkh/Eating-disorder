
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  ArrowLeft, 
  Edit, 
  Settings,
  LogOut,
  Shield,
  BellRing,
  HelpCircle,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Profile = () => {
  const { currentUser, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });
  
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mindfulNotifications') || JSON.stringify({
        reminders: true,
        tips: true,
        milestones: true,
      }));
    } catch (error) {
      return {
        reminders: true,
        tips: true, 
        milestones: true,
      };
    }
  });
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleUpdateProfile = () => {
    if (!profileData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    updateUser({ name: profileData.name });
    setIsEditProfileOpen(false);
    toast.success('Profile updated successfully');
  };
  
  const handleNotificationChange = (type: keyof typeof notifications) => {
    const updatedNotifications = {
      ...notifications,
      [type]: !notifications[type]
    };
    
    setNotifications(updatedNotifications);
    localStorage.setItem('mindfulNotifications', JSON.stringify(updatedNotifications));
  };
  
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </div>
      
      {/* Profile Card */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-medium">{currentUser?.name}</h3>
              <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditProfileOpen(true)}
            >
              <Edit className="h-5 w-5" />
              <span className="sr-only">Edit Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <BellRing className="h-5 w-5" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Daily Reminders</p>
                <p className="text-xs text-muted-foreground">
                  Get reminded to log your meals and mood
                </p>
              </div>
              <Switch 
                checked={notifications.reminders}
                onCheckedChange={() => handleNotificationChange('reminders')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Weekly Tips</p>
                <p className="text-xs text-muted-foreground">
                  Receive helpful recovery strategies
                </p>
              </div>
              <Switch 
                checked={notifications.tips}
                onCheckedChange={() => handleNotificationChange('tips')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Milestone Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Celebrate your recovery progress
                </p>
              </div>
              <Switch 
                checked={notifications.milestones}
                onCheckedChange={() => handleNotificationChange('milestones')}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy & Security */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle className="text-lg">Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => toast.info('This would open privacy settings.')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Privacy Settings
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast.info('This would open data controls.')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Data & Storage
            </Button>
          </CardContent>
        </Card>
        
        {/* Help & Support */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <CardTitle className="text-lg">Help & Support</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/learn')}
            >
              Resource Center
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => toast.info('This would contact support.')}
            >
              Contact Support
            </Button>
          </CardContent>
        </Card>
        
        {/* Logout */}
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profileData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
