
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InfoIcon, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FoodModel } from './FoodModel';
import { ModelSelector } from './ModelSelector';

export const PortionVisualizer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  
  const foodCategories = ['Proteins', 'Carbohydrates', 'Vegetables', 'Fruits', 'Dairy', 'Fats'];
  
  // Function to load a 3D model
  const loadModel = (category: string) => {
    setIsLoading(true);
    setActiveModel(null);
    
    toast.info(`Loading ${category.toLowerCase()} portions...`);
    
    // Simulate loading time
    setTimeout(() => {
      setActiveModel(category);
      setIsLoading(false);
      toast.success(`Loaded ${category.toLowerCase()} portion model!`);
    }, 800);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Portion Models</CardTitle>
        <CardDescription>
          Visualize what healthy portion sizes look like
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3D canvas for rendering models */}
        <div className="aspect-video bg-secondary/30 rounded-lg flex flex-col items-center justify-center relative">
          {!activeModel && !isLoading ? (
            <p className="text-muted-foreground mb-4">3D Visualization Area</p>
          ) : null}
          
          <FoodModel modelType={activeModel} isLoading={isLoading} />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg">
              <div className="flex flex-col items-center">
                <RotateCw className="h-8 w-8 animate-spin text-primary mb-2" />
                <p>Loading model...</p>
              </div>
            </div>
          )}
          
          {!activeModel && !isLoading && (
            <Button onClick={() => loadModel('Balanced')}>
              Load 3D Model
            </Button>
          )}
        </div>
        
        <ModelSelector 
          categories={foodCategories}
          onSelect={loadModel}
          isLoading={isLoading}
        />
        
        <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 dark:bg-blue-950/30">
          <InfoIcon className="h-5 w-5 text-blue-700 shrink-0 mt-0.5 dark:text-blue-400" />
          <div className="text-sm">
            <p className="font-medium">Understanding Portion Sizes</p>
            <p className="text-muted-foreground">
              These visual models show recommended portion sizes based on nutritional guidelines. Remember that individual needs vary based on age, activity level, and specific health considerations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
