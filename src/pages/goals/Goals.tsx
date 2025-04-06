
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flag, 
  Sparkles, 
  ArrowLeft, 
  Plus, 
  Check, 
  Edit, 
  Trash 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { createGoalFromAI } from '@/lib/ai-helpers';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  createdAt: string;
}

const Goals = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('mindfulGoals') || '[]');
    } catch (error) {
      console.error('Error loading goals:', error);
      return [];
    }
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '' });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleSaveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('mindfulGoals', JSON.stringify(updatedGoals));
  };
  
  const handleAddGoal = () => {
    if (!newGoal.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }
    
    const goal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedGoals = [...goals, goal];
    handleSaveGoals(updatedGoals);
    setNewGoal({ title: '', description: '' });
    setIsAddDialogOpen(false);
    toast.success('Goal added successfully');
    
    // Update goal progress data in localStorage for the dashboard
    const progressData = { progress: 0, lastUpdate: new Date().toISOString() };
    localStorage.setItem('mindfulProgressData', JSON.stringify(progressData));
  };
  
  const handleEditGoal = () => {
    if (!editingGoal || !editingGoal.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }
    
    const updatedGoals = goals.map(g => 
      g.id === editingGoal.id ? editingGoal : g
    );
    
    handleSaveGoals(updatedGoals);
    setEditingGoal(null);
    setIsEditDialogOpen(false);
    toast.success('Goal updated successfully');
  };
  
  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    handleSaveGoals(updatedGoals);
    toast.success('Goal deleted');
  };
  
  const handleUpdateProgress = (id: string, progress: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, progress } : goal
    );
    
    handleSaveGoals(updatedGoals);
    
    // Update progress data in localStorage for the dashboard
    const currentGoal = goals.find(g => g.id === id);
    if (currentGoal && progress > 0) {
      const progressData = { 
        progress, 
        lastUpdate: new Date().toISOString(),
        goalTitle: currentGoal.title
      };
      localStorage.setItem('mindfulProgressData', JSON.stringify(progressData));
    }
  };
  
  const handleGenerateGoal = async () => {
    setIsGenerating(true);
    try {
      // In a real app, this would call an AI API with user context
      const generatedGoal = await createGoalFromAI();
      setNewGoal({
        title: generatedGoal.title,
        description: generatedGoal.description
      });
    } catch (error) {
      console.error('Error generating goal:', error);
      toast.error('Failed to generate goal. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
          <h1 className="text-2xl font-bold">My Goals</h1>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>
      
      {/* Empty state */}
      {goals.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Flag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No goals yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first recovery goal to track your progress
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Goals list */}
      {goals.length > 0 && (
        <div className="space-y-4">
          {goals.map(goal => (
            <Card key={goal.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setEditingGoal(goal);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {goal.description && (
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateProgress(goal.id, Math.max(0, goal.progress - 10))}
                    disabled={goal.progress <= 0}
                  >
                    Decrease
                  </Button>
                  <Button
                    variant="outline"
                    size="sm" 
                    onClick={() => handleUpdateProgress(goal.id, Math.min(100, goal.progress + 10))}
                    disabled={goal.progress >= 100}
                  >
                    {goal.progress < 100 ? "Increase" : "Completed!"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Goal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Create a meaningful goal to support your recovery journey
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Goal Title
              </label>
              <Input
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="e.g., Eat three balanced meals per day"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="What does success look like for this goal?"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGenerateGoal}
                disabled={isGenerating}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Goal with AI"}
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Goal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              Update your goal details
            </DialogDescription>
          </DialogHeader>
          
          {editingGoal && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Goal Title
                </label>
                <Input
                  id="edit-title"
                  value={editingGoal.title}
                  onChange={(e) => setEditingGoal({...editingGoal, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  value={editingGoal.description}
                  onChange={(e) => setEditingGoal({...editingGoal, description: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-progress" className="text-sm font-medium">
                  Progress: {editingGoal.progress}%
                </label>
                <div className="flex items-center space-x-4 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingGoal({
                      ...editingGoal,
                      progress: Math.max(0, editingGoal.progress - 10)
                    })}
                    disabled={editingGoal.progress <= 0}
                  >
                    -10%
                  </Button>
                  
                  <Progress 
                    value={editingGoal.progress} 
                    className="flex-1 h-2" 
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingGoal({
                      ...editingGoal,
                      progress: Math.min(100, editingGoal.progress + 10)
                    })}
                    disabled={editingGoal.progress >= 100}
                  >
                    +10%
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditGoal}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;
