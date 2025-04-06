
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { InfoIcon, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

const Visualizer = () => {
  const [activeTab, setActiveTab] = useState('portions');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Effect to handle 3D rendering when model changes
  useEffect(() => {
    if (!canvasRef.current || !activeModel) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simple placeholder drawings for different food types
    // In a real app, this would use Three.js or another 3D library
    ctx.fillStyle = getFillColor(activeModel);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    switch (activeModel) {
      case 'Proteins':
        // Draw a simple meat/protein shape
        drawProtein(ctx, centerX, centerY);
        break;
      case 'Carbohydrates':
        // Draw a bread/pasta shape
        drawCarbs(ctx, centerX, centerY);
        break;
      case 'Vegetables':
        // Draw a simple vegetable shape
        drawVegetable(ctx, centerX, centerY);
        break;
      case 'Fruits':
        // Draw a simple fruit shape
        drawFruit(ctx, centerX, centerY);
        break;
      case 'Dairy':
        // Draw a milk/dairy shape
        drawDairy(ctx, centerX, centerY);
        break;
      case 'Fats':
        // Draw a simple oil/fat shape
        drawFats(ctx, centerX, centerY);
        break;
      default:
        // Draw a plate as default
        drawPlate(ctx, centerX, centerY);
        break;
    }
  }, [activeModel]);
  
  // Helper functions for drawing simple food shapes
  const getFillColor = (foodType: string): string => {
    switch (foodType) {
      case 'Proteins': return '#F9A78D'; // Pinkish for meat
      case 'Carbohydrates': return '#F5DEB3'; // Wheat color
      case 'Vegetables': return '#90EE90'; // Light green
      case 'Fruits': return '#FF8C00'; // Orange
      case 'Dairy': return '#FFF8DC'; // Cream color
      case 'Fats': return '#FFD700'; // Gold for oils
      default: return '#FFFFFF';
    }
  };
  
  const drawPlate = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw a simple plate
    ctx.beginPath();
    ctx.arc(x, y, 100, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.stroke();
    
    // Add a rim
    ctx.beginPath();
    ctx.arc(x, y, 120, 0, Math.PI * 2);
    ctx.stroke();
  };
  
  const drawProtein = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw a simple meat/protein shape
    ctx.beginPath();
    ctx.ellipse(x, y, 80, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Add some texture lines
    ctx.beginPath();
    ctx.moveTo(x - 40, y - 20);
    ctx.lineTo(x + 40, y - 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x - 30, y);
    ctx.lineTo(x + 30, y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x - 40, y + 20);
    ctx.lineTo(x + 40, y + 20);
    ctx.stroke();
  };
  
  const drawCarbs = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw bread shape
    ctx.beginPath();
    ctx.roundRect(x - 70, y - 40, 140, 80, 20);
    ctx.fill();
    ctx.stroke();
    
    // Add texture lines
    for (let i = -50; i <= 50; i += 20) {
      ctx.beginPath();
      ctx.moveTo(x + i, y - 30);
      ctx.lineTo(x + i, y + 30);
      ctx.stroke();
    }
  };
  
  const drawVegetable = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw broccoli-like shape
    const baseX = x;
    const baseY = y + 30;
    
    // Stem
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(baseX, baseY - 40);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#3CB043';
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    
    // Florets
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const flX = baseX + Math.cos(angle) * 40;
      const flY = (baseY - 60) + Math.sin(angle) * 20;
      
      ctx.beginPath();
      ctx.arc(flX, flY, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#90EE90';
      ctx.fill();
      ctx.stroke();
    }
    
    // Center floret
    ctx.beginPath();
    ctx.arc(baseX, baseY - 70, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#90EE90';
    ctx.fill();
    ctx.stroke();
  };
  
  const drawFruit = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw apple-like shape
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Stem
    ctx.beginPath();
    ctx.moveTo(x, y - 50);
    ctx.lineTo(x, y - 65);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#654321';
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    
    // Leaf
    ctx.beginPath();
    ctx.ellipse(x + 10, y - 60, 10, 5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = '#228B22';
    ctx.fill();
    ctx.stroke();
  };
  
  const drawDairy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw milk carton
    ctx.beginPath();
    ctx.roundRect(x - 40, y - 60, 80, 120, 5);
    ctx.fill();
    ctx.stroke();
    
    // Add carton details
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 50, 60, 30, 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 10, 60, 30, 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.roundRect(x - 30, y + 30, 60, 20, 2);
    ctx.stroke();
  };
  
  const drawFats = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Draw oil bottle
    ctx.beginPath();
    ctx.roundRect(x - 25, y - 10, 50, 70, 5);
    ctx.fill();
    ctx.stroke();
    
    // Bottle neck
    ctx.beginPath();
    ctx.roundRect(x - 15, y - 40, 30, 30, 5);
    ctx.fill();
    ctx.stroke();
    
    // Cap
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 55, 20, 15, 3);
    ctx.fillStyle = '#555';
    ctx.fill();
    ctx.stroke();
  };
  
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">3D Food Visualizer</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="portions">Portions</TabsTrigger>
          <TabsTrigger value="meals">Balanced Meals</TabsTrigger>
          <TabsTrigger value="mindful">Mindful Eating</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portions">
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
                
                <canvas 
                  ref={canvasRef} 
                  width="600" 
                  height="400" 
                  className="rounded-lg w-full h-full"
                ></canvas>
                
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
              
              <div className="grid grid-cols-3 gap-2">
                {['Proteins', 'Carbohydrates', 'Vegetables', 'Fruits', 'Dairy', 'Fats'].map((category) => (
                  <Button 
                    key={category} 
                    variant="outline"
                    className="text-sm"
                    onClick={() => loadModel(category)}
                    disabled={isLoading}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
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
        </TabsContent>
        
        <TabsContent value="meals">
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
        </TabsContent>
        
        <TabsContent value="mindful">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Visualizer;
