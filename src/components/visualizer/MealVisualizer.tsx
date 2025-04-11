
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const MealVisualizer = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balanced Meal Visualization</CardTitle>
        <CardDescription>
          See what balanced meals look like
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center">
          <canvas 
            width="600" 
            height="400" 
            className="rounded-lg w-full h-full"
          ></canvas>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            onClick={() => toast.info("Loading breakfast options...")}
          >
            Breakfast Options
          </Button>
          <Button 
            variant="outline"
            onClick={() => toast.info("Loading lunch options...")}
          >
            Lunch Options
          </Button>
          <Button 
            variant="outline"
            onClick={() => toast.info("Loading dinner options...")}
          >
            Dinner Options
          </Button>
          <Button 
            variant="outline"
            onClick={() => toast.info("Loading snack options...")}
          >
            Healthy Snacks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
