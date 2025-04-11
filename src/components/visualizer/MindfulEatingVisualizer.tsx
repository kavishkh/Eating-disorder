
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const MindfulEatingVisualizer = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mindful Eating Animations</CardTitle>
        <CardDescription>
          Interactive guides to practice mindful eating
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">
            Mindful eating animations will appear here
          </p>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="bg-green-50 p-3 rounded-lg dark:bg-green-950/30">
            <h3 className="font-medium mb-1">Breathing Exercise</h3>
            <p className="text-sm text-muted-foreground">
              Take 5 deep breaths before eating to center yourself and prepare for your meal.
            </p>
            <Button 
              size="sm" 
              variant="outline"
              className="mt-2"
              onClick={() => toast.info("Starting breathing animation...")}
            >
              Start Exercise
            </Button>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-lg dark:bg-amber-950/30">
            <h3 className="font-medium mb-1">Mindful Bite Sequence</h3>
            <p className="text-sm text-muted-foreground">
              Learn to take smaller bites and chew thoroughly to improve digestion and meal satisfaction.
            </p>
            <Button 
              size="sm" 
              variant="outline"
              className="mt-2"
              onClick={() => toast.info("Starting mindful bites animation...")}
            >
              Start Exercise
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
