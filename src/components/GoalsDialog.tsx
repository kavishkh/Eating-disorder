
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goals: string[];
  onSaveGoals: (goals: string[]) => void;
}

const GoalsDialog: React.FC<GoalsDialogProps> = ({
  open,
  onOpenChange,
  goals,
  onSaveGoals,
}) => {
  const [editedGoals, setEditedGoals] = useState<string[]>([...goals]);
  const [newGoal, setNewGoal] = useState("");
  const { toast } = useToast();

  const handleAddGoal = () => {
    if (newGoal.trim() === "") {
      toast({
        title: "Empty goal",
        description: "Please enter a goal",
        variant: "destructive",
      });
      return;
    }

    setEditedGoals([...editedGoals, newGoal.trim()]);
    setNewGoal("");
  };

  const handleRemoveGoal = (index: number) => {
    const updatedGoals = [...editedGoals];
    updatedGoals.splice(index, 1);
    setEditedGoals(updatedGoals);
  };

  const handleEditGoal = (index: number, value: string) => {
    const updatedGoals = [...editedGoals];
    updatedGoals[index] = value;
    setEditedGoals(updatedGoals);
  };

  const handleSave = () => {
    onSaveGoals(editedGoals);
    toast({
      title: "Goals updated",
      description: "Your goals have been saved successfully",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-healing-800">My Recovery Goals</DialogTitle>
          <DialogDescription>
            View and edit your goals. These goals help track your progress through your recovery journey.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto pr-2">
          {editedGoals.length === 0 ? (
            <p className="text-center text-gray-500 py-4">You haven't set any goals yet. Add your first goal below.</p>
          ) : (
            editedGoals.map((goal, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <Input 
                    value={goal}
                    onChange={(e) => handleEditGoal(index, e.target.value)}
                    className="border-healing-200"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveGoal(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Add a new goal..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="flex-1 border-healing-200"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddGoal();
              }
            }}
          />
          <Button 
            onClick={handleAddGoal} 
            className="bg-healing-500 hover:bg-healing-600 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="mt-2 sm:mt-0"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-healing-600 hover:bg-healing-700 text-white"
          >
            <Save className="h-4 w-4 mr-1" /> Save Goals
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoalsDialog;
