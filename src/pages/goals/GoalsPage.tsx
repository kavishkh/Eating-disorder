
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flag, 
  Sparkles, 
  ArrowLeft, 
  Plus, 
  Check, 
  Edit, 
  Trash,
  RefreshCw,
  Lightbulb,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { createGoalFromAI, analyzeGoalProgress, generateMultipleGoalSuggestions } from '@/lib/ai-helpers';
import { AiGeneratedGoal, Goal } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/services/databaseService';

const GoalsPage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', category: '', difficulty: '' as 'beginner' | 'intermediate' | 'advanced' | '' });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [goalSuggestions, setGoalSuggestions] = useState<AiGeneratedGoal[]>([]);
  const [progressFeedback, setProgressFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  
  useEffect(() => {
    loadGoals();
  }, []);
  
  const loadGoals = async () => {
    const loadedGoals = await db.getGoals();
    setGoals(loadedGoals);
  };
  
  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }
    
    await db.addGoal({
      title: newGoal.title,
      description: newGoal.description,
      progress: 0,
      category: newGoal.category || undefined,
      difficulty: newGoal.difficulty || undefined
    });
    
    loadGoals();
    setNewGoal({ title: '', description: '', category: '', difficulty: '' });
    setIsAddDialogOpen(false);
    toast.success('Goal added successfully');
    
    // Update goal progress data
    const progressData = { progress: 0, lastUpdate: new Date().toISOString() };
    localStorage.setItem('mindfulProgressData', JSON.stringify(progressData));
  };
  
  const handleEditGoal = async () => {
    if (!editingGoal || !editingGoal.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }
    
    await db.updateGoal(editingGoal.id, editingGoal);
    loadGoals();
    setEditingGoal(null);
    setIsEditDialogOpen(false);
    toast.success('Goal updated successfully');
  };
  
  const handleDeleteGoal = async (id: string) => {
    await db.deleteGoal(id);
    loadGoals();
    toast.success('Goal deleted');
  };
  
  const handleUpdateProgress = async (id: string, progress: number) => {
    const currentGoal = goals.find(g => g.id === id);
    if (!currentGoal) return;
    
    await db.updateGoal(id, { progress });
    loadGoals();
    
    // Update progress data for the dashboard
    if (progress > 0) {
      const progressData = { 
        progress, 
        lastUpdate: new Date().toISOString(),
        goalTitle: currentGoal.title
      };
      localStorage.setItem('mindfulProgressData', JSON.stringify(progressData));
      
      // Get AI feedback on goal progress
      try {
        const feedback = await analyzeGoalProgress(currentGoal.title, progress);
        setProgressFeedback(feedback);
        setShowFeedback(true);
        
        // Auto-hide feedback after 5 seconds
        setTimeout(() => {
          setShowFeedback(false);
        }, 5000);
      } catch (error) {
        console.error('Error getting progress feedback:', error);
      }
    }
  };
  
  const handleGenerateGoal = async () => {
    setIsGenerating(true);
    try {
      const generatedGoal = await createGoalFromAI();
      setNewGoal({
        title: generatedGoal.title,
        description: generatedGoal.description,
        category: generatedGoal.category || '',
        difficulty: generatedGoal.difficulty || ''
      });
      toast.success('Goal generated with AI');
    } catch (error) {
      console.error('Error generating goal:', error);
      toast.error('Failed to generate goal. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleLoadSuggestions = async () => {
    try {
      setIsGenerating(true);
      const suggestions = await generateMultipleGoalSuggestions(3);
      setGoalSuggestions(suggestions);
      setIsSuggestionsOpen(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to get goal suggestions');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSelectSuggestion = (suggestion: AiGeneratedGoal) => {
    setNewGoal({
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category || '',
      difficulty: suggestion.difficulty || ''
    });
    setIsSuggestionsOpen(false);
    setIsAddDialogOpen(true);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleLoadSuggestions} disabled={isGenerating}>
            <Lightbulb className="mr-2 h-4 w-4" />
            {isGenerating ? 'Loading...' : 'Goal Ideas'}
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </div>
      </div>

      {/* AI Progress Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary-foreground border border-primary/20 rounded-lg p-4 shadow-lg relative"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2"
              onClick={() => setShowFeedback(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">AI Progress Insight</h3>
                <p className="text-sm text-muted-foreground">{progressFeedback}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Empty state */}
      {goals.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Flag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No goals yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first recovery goal to track your progress
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleLoadSuggestions} disabled={isGenerating}>
                <Lightbulb className="mr-2 h-4 w-4" />
                {isGenerating ? 'Loading...' : 'Get AI Suggestions'}
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Goal
              </Button>
            </div>
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
                  <div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      {goal.category && (
                        <Badge variant="outline">{goal.category}</Badge>
                      )}
                      {goal.difficulty && (
                        <Badge className={getDifficultyColor(goal.difficulty)}>
                          {goal.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="category"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  placeholder="e.g., Nutrition"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="difficulty" className="text-sm font-medium">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={newGoal.difficulty}
                  onChange={(e) => setNewGoal({...newGoal, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' | ''})}
                >
                  <option value="">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-category" className="text-sm font-medium">
                    Category
                  </label>
                  <Input
                    id="edit-category"
                    value={editingGoal.category || ''}
                    onChange={(e) => setEditingGoal({...editingGoal, category: e.target.value})}
                    placeholder="e.g., Nutrition"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-difficulty" className="text-sm font-medium">
                    Difficulty
                  </label>
                  <select
                    id="edit-difficulty"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={editingGoal.difficulty || ''}
                    onChange={(e) => setEditingGoal({...editingGoal, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' | undefined})}
                  >
                    <option value="">Select difficulty</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
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
      
      {/* Goal Suggestions Dialog */}
      <Dialog open={isSuggestionsOpen} onOpenChange={setIsSuggestionsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI Goal Suggestions</DialogTitle>
            <DialogDescription>
              Choose a goal from these AI-generated suggestions
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {goalSuggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
                <p className="text-muted-foreground">Generating suggestions...</p>
              </div>
            ) : (
              goalSuggestions.map((suggestion, index) => (
                <Card key={index} className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleSelectSuggestion(suggestion)}>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{suggestion.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                    <div className="flex gap-2">
                      {suggestion.category && (
                        <Badge variant="outline">{suggestion.category}</Badge>
                      )}
                      {suggestion.difficulty && (
                        <Badge className={getDifficultyColor(suggestion.difficulty)}>
                          {suggestion.difficulty}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 p-2 flex justify-end">
                    <Button size="sm" variant="secondary">
                      <Check className="h-3 w-3 mr-1" />
                      Select
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
            
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLoadSuggestions}
                disabled={isGenerating}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : 'Refresh Suggestions'}
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSuggestionsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsSuggestionsOpen(false);
              setIsAddDialogOpen(true);
            }}>
              Create Custom Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalsPage;
